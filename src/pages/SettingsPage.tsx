import { Component } from "react";
import WebcamPreview from "../components/WebcamPreview";
import MediaDeviceSelector from "../components/DevicePreview";
import RecordPreviewButton from "../components/RecordPreviewButton";
import WebcamMediaDevice from "../utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "../utils/MicrophoneMediaDevice";
import MultiMediaDevice from "../utils/MultiMediaDevice";

interface Props {
  devices: MultiMediaDevice
}

class SettingsPage extends Component<Props, any> {

  public readonly devices = this.props.devices;

  public render() {
    const webcam: WebcamMediaDevice = this.devices.getWebcam();
    const microphone: MicrophoneMediaDevice = this.devices.getMicrophone();

    console.log("Settings page webcam: ", webcam);
    console.log("Settings page mic: ", microphone);

    return (
      <div>
        <WebcamPreview webcam={ webcam }/>
        <MediaDeviceSelector webcam={ webcam } microphone={ microphone }/>
        <RecordPreviewButton devices={this.devices} />
      </div>
    );
  }
}

export default SettingsPage;
