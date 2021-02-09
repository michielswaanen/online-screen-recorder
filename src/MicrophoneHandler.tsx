import { Component } from "react";
import MicrophoneRecorder from "./utils/MicrophoneRecorder";

interface State {
  enabled: boolean
  phase: "ask" | "setup" | "record" | "watch"
  devices: MediaDeviceInfo[]
}

class MicrophoneHandler extends Component<any, State> {

  public state: State = {
    enabled: false,
    phase: "ask",
    devices: []
  }

  private microphone: MicrophoneRecorder = new MicrophoneRecorder();

  public async componentDidMount() {

    this.microphone.onPermissionChange((async (status: "granted" | "denied") => {
      if (status === "granted") {
        this.setState({
          devices: await this.microphone.getDeviceOptions(),
          phase: "setup"
        });
      }
    }));

    this.microphone.onStreamAvailable((stream: MediaStream) => {
      const microphone: HTMLAudioElement = document.getElementById("microphone-live") as HTMLAudioElement;
      microphone.srcObject = stream;
    });

    this.microphone.onStart(() => {

    });

    this.microphone.onStop(() => {
      this.setState({phase: "watch"});
    });

    this.microphone.onRecordingAvailable((recording: Blob) => {
      const microphone: HTMLAudioElement = document.getElementById("microphone-recording") as HTMLAudioElement;
      microphone.src = URL.createObjectURL(recording);
    });
  }

  private switchDevice = async () => {
    const devices: HTMLSelectElement = document.getElementById("webcam-options") as HTMLSelectElement;
    this.microphone.switchDevice(devices.value);
  }

  public renderAskPhase() {
    return (
      <div>
        <button onClick={ () => this.microphone.askPermission() }>
          Enable Microphone
        </button>
      </div>
    )
  }

  public renderSetupPhase() {
    return (
      <div>
        Say something!
        <audio autoPlay={ true } id="microphone-live" />
        <select name="webcam-options" id="webcam-options">
          { this.state.devices.map((device => {
            return <option value={ device.deviceId }>{ device.label }</option>
          })) }
        </select>
        <button onClick={ this.switchDevice }>Switch</button>

        <button onClick={() => {this.setState({phase: "record"})}}>I hear myself loud & clear, next!</button>
      </div>
    )
  }

  public renderRecordPhase() {
    return(
      <div>
        <audio autoPlay={ true } id="microphone-live" />
        <button onClick={ this.microphone.start.bind(this.microphone) }>Start</button>
        <button onClick={ () => {this.setState({phase: "watch"}); this.microphone.stop()} }>Stop</button>
      </div>
    )
  }

  public renderWatchPhase() {
    return(
      <div>
        <audio autoPlay={ false } controls id="microphone-recording" />
        <button onClick={() => {this.setState({phase: "setup"}); }}>Record again</button>
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

export default MicrophoneHandler;