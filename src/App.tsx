import { Component } from "react";
import MicrophoneHandler from "./MicrophoneHandler";
import WebcamHandler from "./WebcamHandler";

class App extends Component<any, any> {



  render() {
    return(
      <div>
        <MicrophoneHandler />
        <WebcamHandler />
      </div>
    )
  }
}

export default App;