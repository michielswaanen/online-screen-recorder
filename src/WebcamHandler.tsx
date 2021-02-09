import { Component } from "react";
import WebcamRecorder from "./utils/WebcamRecorder";
import MicrophoneRecorder from "./utils/MicrophoneRecorder";

const webcam = new WebcamRecorder();

interface State {
  startDisabled: boolean,
  stopDisabled: boolean,
  switchDisabled: boolean,
  recordingAvailable: boolean,
  webcamEnabled: boolean,
  phase: "setup" | "record" | "watch"
  devices: MediaDeviceInfo[]
}

class WebcamHandler extends Component<any, State> {

  public state: State = {
    startDisabled: true,
    stopDisabled: true,
    switchDisabled: true,
    recordingAvailable: false,
    webcamEnabled: false,
    phase: "setup",
    devices: []
  }

  async componentDidMount() {

    const devices = await webcam.getDeviceOptions();

    this.setState({
      devices: devices
    })

    // Events
    webcam.onPermissionChange((status: "granted" | "denied") => {
      if (status === "granted") {
        this.setState({
          startDisabled: false,
          switchDisabled: false,
          stopDisabled: true
        });
      }

      console.log('Permission changed to ' + status);
    });

    webcam.onStart((stream) => {
      this.setState({
        startDisabled: true,
        switchDisabled: true,
        stopDisabled: false,
        recordingAvailable: false
      });

      console.log('Callback started!');
    });

    webcam.onStop(() => {
      this.setState({
        startDisabled: false,
        switchDisabled: false,
        stopDisabled: true
      });

      console.log("Callback stopped!");
    });

    webcam.onStreamAvailable((stream => {
      console.log('New Stream!', stream)
      const webcamVisual: HTMLVideoElement = document.getElementById("webcam-live") as HTMLVideoElement;
      webcamVisual.srcObject = stream;
    }));

    webcam.onRecordingAvailable((recording => {
      console.log("Data available!!!", recording);

      this.setState({
        recordingAvailable: true
      })

      const webcamVisual: HTMLVideoElement = document.getElementById("webcam-recording") as HTMLVideoElement;
      webcamVisual.srcObject = null
      webcamVisual.src = URL.createObjectURL(recording);
    }))
  }

  private switchDevice = async () => {
    const devices: HTMLSelectElement = document.getElementById("webcam-options") as HTMLSelectElement;
    webcam.switchDevice(devices.value);
  }

  renderOptions() {
    return (
      <select name="webcam-options" id="webcam-options">
        { this.state.devices.map((device => {
          return <option value={ device.deviceId }>{ device.label }</option>
        })) }
      </select>
    )
  }

  renderSetup() {
    const enable = this.state.webcamEnabled;

    if (enable) {
      return(
        <div>
          <video autoPlay={ true } height={ 360 } width={ 540 } id="webcam-live" />
          { this.renderOptions() }
          <button disabled={ this.state.switchDisabled } onClick={ this.switchDevice }>Switch</button>
          <button onClick={() => this.setState({phase: "record"})}>Looks great, next!</button>
        </div>
      )
    } else {
      return(
        <div>
          <button onClick={async () => {
            try {
              await webcam.askPermission();
              this.setState({webcamEnabled: true});
            } catch (e) {
              this.setState({webcamEnabled: false});
            }
          } }>Enable Webcam</button>
        </div>
      )
    }
  }

  renderRecord() {
    return (
      <div>
        <video autoPlay={ true } height={ 360 } width={ 540 } id="webcam-live" />
        <button disabled={ this.state.startDisabled } onClick={ webcam.start }>Start</button>
        <button disabled={ this.state.stopDisabled } onClick={ () => {this.setState({phase: "watch"}); webcam.stop()} }>Stop</button>

      </div>
    )
  }

  renderWatch() {
    return(
      <div>
        <video autoPlay={ false } controls height={ 720 } width={ 1080 } id="webcam-recording"/>
        <button onClick={() => {this.setState({phase: "setup"}); }}>Record again</button>
      </div>
    )
  }

  render() {
    if(this.state.phase === "setup") {
      return this.renderSetup();
    } else if (this.state.phase === "record") {
      return this.renderRecord();
    } else {
      return this.renderWatch();
    }

  }
}

export default WebcamHandler;