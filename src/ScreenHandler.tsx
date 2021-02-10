import { Component } from "react";
import ScreenRecorder from "./utils/ScreenRecorder";

interface State {
  enabled: boolean
  phase: "ask" | "setup" | "record" | "watch"
  devices: MediaDeviceInfo[]
}

class ScreenHandler extends Component<any, State> {

  private screen: ScreenRecorder = new ScreenRecorder();

  public state: State = {
    enabled: false,
    phase: "ask",
    devices: []
  }

  public async componentDidMount() {

    this.screen.onPermissionChange((async (status: "granted" | "denied") => {
      console.log("Screen permission changed!")
      if (status === "granted") {
        try {
          const devices = await this.screen.getDeviceOptions();
          this.setState({
            devices: devices,
            phase: "setup"
          });
        } catch (e) {
          throw new Error("Couldn't load audio input devices!");
        }
      }
    }));

    this.screen.onStreamTrackAvailable((track: MediaStreamTrack) => {
      const screen: HTMLVideoElement = document.getElementById("screen-live") as HTMLVideoElement;
      screen.srcObject = new MediaStream([track]);
    });

    this.screen.onStart(() => {
      console.log("Screen stream started");
    });

    this.screen.onStop(() => {
      this.setState({phase: "watch"});

      console.log("Screen stream stopped!");
    });

    this.screen.onRecordingAvailable((recording: Blob) => {
      const screen: HTMLVideoElement = document.getElementById("screen-recording") as HTMLVideoElement;
      screen.src = URL.createObjectURL(recording);
    });
  }

  public renderAskPhase() {
    return (
      <div>
        <button onClick={ () => this.screen.askPermission() }>
          Enable Screen share
        </button>
      </div>
    )
  }

  public renderSetupPhase() {
    return (
      <div>
        Do something on your screen
        <video autoPlay={ true } height={ 360 } width={ 540 } id="screen-live"/>

        <button onClick={ this.screen.askPermission.bind(this.screen) }>Choose another screen</button>

        <button onClick={() => {this.setState({phase: "record"})}}>This is the right screen, next!</button>
      </div>
    )
  }

  public renderRecordPhase() {
    return(
      <div>
        <video autoPlay={ true } height={ 360 } width={ 540 } id="screen-live"/>
        <button onClick={ this.screen.start.bind(this.screen) }>Start</button>
        <button onClick={ () => {this.setState({phase: "watch"}); this.screen.stop()} }>Stop</button>
      </div>
    )
  }

  public renderWatchPhase() {
    return(
      <div>
        <video autoPlay={ false } controls height={ 360 } width={ 540 } id="screen-recording"/>
        <button onClick={() => {this.setState({phase: "ask"}); }}>Record again</button>
      </div>
    )
  }

  public render() {
    if (this.state.phase === "ask") {
      return this.renderAskPhase();
    } else if(this.state.phase === "setup") {
      return this.renderSetupPhase();
    } else if (this.state.phase === "record") {
      return this.renderRecordPhase();
    } else {
      return this.renderWatchPhase();
    }
  }

}

export default ScreenHandler;