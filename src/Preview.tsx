import { Component } from "react";
import WebcamPreview from "./WebcamPreview";
import MediaDeviceSelector from "./DevicePreview";
import RecordPreviewButton from "./RecordPreviewButton";
import WebcamMediaDevice from "./utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "./utils/MicrophoneMediaDevice";

interface Props {
 webcam: WebcamMediaDevice,
 microphone: MicrophoneMediaDevice
}

class Preview extends Component<Props, any> {

  private readonly webcam: WebcamMediaDevice = this.props.webcam;
  private readonly microphone: MicrophoneMediaDevice = this.props.microphone;

  public render() {
    return (
      <div>
        <WebcamPreview webcam={ this.webcam }/>
        <MediaDeviceSelector webcam={ this.webcam } microphone={ this.microphone }/>
        <RecordPreviewButton webcam={ this.webcam } microphone={ this.microphone }/>
      </div>
    );
  }
}

export default Preview;