import { Component } from "react";
import MicrophoneHandler from "./MicrophoneHandler";
import WebcamHandler from "./WebcamHandler";
import ScreenHandler from "./ScreenHandler";

class App extends Component<any, any> {



  render() {
    return(
      <div>
        <MicrophoneHandler />
        <WebcamHandler />
        <ScreenHandler />
      </div>
    )
  }
}

export default App;