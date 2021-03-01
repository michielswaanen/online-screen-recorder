import { Component } from "react";
import MultiMediaDevice from "../utils/MultiMediaDevice";
import ScreenMediaDevice from "../utils/ScreenMediaDevice";
import WebcamMediaDevice from "../utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "../utils/MicrophoneMediaDevice";

interface Props {
  devices: MultiMediaDevice
  continueCallback: () => void
}

class PermissionPage extends Component<Props, any> {

  public readonly devices = this.props.devices;


  public componentDidMount() {
    if(this.devices.areReady()) {
      this.props.continueCallback();
    } else {
      this.devices.onReady(this.continueCallback);
    }
  }

  private continueCallback = () => {
    this.props.continueCallback();
  }

  public render() {
    const screen: ScreenMediaDevice = this.devices.getScreen();
    const webcam: WebcamMediaDevice = this.devices.getWebcam();
    const microphone: MicrophoneMediaDevice = this.devices.getMicrophone();

    return(
      <div>
        <button onClick={async () => await screen.select()}>Allow Screen</button>
        <button onClick={async () => await microphone.select()}>Allow Microphone</button>
        <button onClick={async () => await webcam.select()}>Allow Webcam</button>
      </div>
    )
  }
}

export default PermissionPage