import { Component } from "react";
import WebcamRecorder from "./utils/WebcamRecorder";

interface State {
  startDisabled: boolean,
  stopDisabled: boolean,
  switchDisabled: boolean,
  recordingAvailable: boolean,
  webcamEnabled: boolean,
  phase: "ask" | "setup" | "record" | "watch"
  devices: MediaDeviceInfo[]
}

class WebcamHandler extends Component<any, State> {

  private webcam: WebcamRecorder = new WebcamRecorder();

  public state: State = {
    startDisabled: true,
    stopDisabled: true,
    switchDisabled: true,
    recordingAvailable: false,
    webcamEnabled: false,
    phase: "ask",
    devices: []
  }

  async componentDidMount() {

    // Events
    this.webcam.onPermissionChange(async (status: "granted" | "denied") => {
      console.log("Video permission changed!")
      if (status === "granted") {
        try {
          const devices = await this.webcam.getDeviceOptions();
          this.setState({
            devices: devices,
            phase: "setup"
          });
        } catch (e) {
          throw new Error("Couldn't load video input devices!");
        }
      }

      console.log('Permission changed to ' + status);
    });

    this.webcam.onStart(() => {
      console.log('Webcam stream started!');
    });

    this.webcam.onStop(() => {
      this.setState({ phase: "watch" });
      console.log("Webcam stream stopped!");
    });

    this.webcam.onStreamTrackAvailable(((stream: MediaStream) => {
      const webcamVisual: HTMLVideoElement = document.getElementById("webcam-live") as HTMLVideoElement;
      webcamVisual.srcObject = stream;
    }));

    this.webcam.onRecordingAvailable((recording: Blob) => {
      const webcamVisual: HTMLVideoElement = document.getElementById("webcam-recording") as HTMLVideoElement;
      webcamVisual.src = URL.createObjectURL(recording);
    });
  }

  private switchDevice = async () => {
    const devices: HTMLSelectElement = document.getElementById("webcam-options") as HTMLSelectElement;
    await this.webcam.switchDevice(devices.value);
  }

  public renderLiveWebcam() {
    return <video autoPlay={ true } height={ 360 } width={ 540 } id="webcam-live"/>
  }

  public renderAskPhase() {
    return (
      <div>
        <button onClick={ () => this.webcam.askPermission() }>
          Enable Webcam
        </button>
      </div>
    )
  }

  public renderSetup() {
    return (
      <div>
        Move!
        { this.renderLiveWebcam() }
        <select name="webcam-options" id="webcam-options">
          { this.state.devices.map((device => {
            return <option value={ device.deviceId }>{ device.label }</option>
          })) }
        </select>
        <button onClick={ this.switchDevice }>Switch</button>

        <button onClick={ () => {
          this.setState({ phase: "record" })
        } }>I see myself clearly, next!
        </button>
      </div>
    )
  }

  public renderRecord() {
    return (
      <div>
        { this.renderLiveWebcam() }
        <button onClick={ this.webcam.start.bind(this.webcam) }>Start</button>
        <button onClick={ () => {
          this.setState({ phase: "watch" });
          this.webcam.stop()
        } }>Stop
        </button>
      </div>
    )
  }

  public renderWatch() {
    return (
      <div>
        <video autoPlay={ false } controls height={ 360 } width={ 540 } id="webcam-recording"/>
        <button onClick={ () => {
          this.setState({ phase: "ask" });
        } }>Record again
        </button>
      </div>
    )
  }

  public render() {
    if (this.state.phase === "ask") {
      return this.renderAskPhase();
    } else if (this.state.phase === "setup") {
      return this.renderSetup();
    } else if (this.state.phase === "record") {
      return this.renderRecord();
    } else {
      return this.renderWatch();
    }

  }
}

export default WebcamHandler;