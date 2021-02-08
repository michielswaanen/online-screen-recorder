import { Component } from "react";
import WebcamRecorder from "./utils/WebcamRecorder";

const webcam = new WebcamRecorder();

interface State {
  startDisabled: boolean,
  stopDisabled: boolean,
  devices: MediaDeviceInfo[]
}

class App extends Component<any, State> {

  public state: State = {
    startDisabled: true,
    stopDisabled: true,
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
          stopDisabled: true
        });
      }

      console.log('Permission changed to ' + status);
    });

    webcam.onStart((stream) => {
      this.setState({
        startDisabled: true,
        stopDisabled: false
      });

      console.log('Callback started!');
    });

    webcam.onStop(() => {
      this.setState({
        startDisabled: false,
        stopDisabled: true
      });

      console.log("Callback stopped!");
    });

    webcam.onStreamAvailable((stream => {
      console.log('New Stream!', stream)
      const webcamVisual: HTMLVideoElement = document.getElementById("webcam-preview") as HTMLVideoElement;
      webcamVisual.srcObject = stream;
    }));

    webcam.onRecordingAvailable((recording => {
      console.log("Data available!!!", recording);
      const webcamVisual: HTMLVideoElement = document.getElementById("webcam-recording") as HTMLVideoElement;
      webcamVisual.src = URL.createObjectURL(recording);
    }))

    // Functions
    await webcam.askPermission();
  }

  private switchDevice = async () => {
    const devices: HTMLSelectElement = document.getElementById("webcam-options") as HTMLSelectElement;
    webcam.switchDevice(devices.value);
  }

  renderOptions() {
    return(
      <select name="webcam-options" id="webcam-options">
        {this.state.devices.map((device => {
          return <option value={device.deviceId}>{device.label}</option>
        }))}
      </select>
    )
  }

  render() {
    return(
      <div>
        <video autoPlay={true} height={360} width={540} id="webcam-preview" />
        <button disabled={this.state.startDisabled} onClick={webcam.start}>Start</button>
        <button disabled={this.state.stopDisabled} onClick={webcam.stop}>Stop</button>
        {this.renderOptions()}
        <button disabled={this.state.stopDisabled} onClick={this.switchDevice}>Switch</button>
        Asking permission...
        <video controls height={360} width={540} id="webcam-recording" />
      </div>
    )
  }
}

export default App;