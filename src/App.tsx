import { Component } from "react";
import WebcamMediaDevice from "./utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "./utils/MicrophoneMediaDevice";
import Preview from "./Preview";

class App extends Component<any, any> {

  render() {
    const webcam: WebcamMediaDevice = new WebcamMediaDevice();
    const microphone: MicrophoneMediaDevice = new MicrophoneMediaDevice();

    webcam.select();
    microphone.select();

    return (
      <div>
        <Preview webcam={ webcam } microphone={ microphone }/>
      </div>
    )
  }
}

export default App;