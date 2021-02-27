import { Component } from "react";
import DevicePreview from "./DevicePreview";
import WebcamPreview from "./WebcamPreview";
import WebcamMediaDevice from "./utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "./utils/MicrophoneMediaDevice";
import RecordPreviewButton from "./RecordPreviewButton";

class App extends Component<any, any> {

  render() {
    const webcam: WebcamMediaDevice = new WebcamMediaDevice();
    const microphone: MicrophoneMediaDevice = new MicrophoneMediaDevice();
    webcam.select();
    microphone.select();

    return (
      <div>
        <WebcamPreview webcam={ webcam }/>
        <DevicePreview webcam={ webcam } microphone={ microphone }/>
        <RecordPreviewButton webcam={ webcam } microphone={ microphone }/>
      </div>
    )
  }
}

export default App;