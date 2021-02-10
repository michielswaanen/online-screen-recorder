import { Component } from "react";
import MicrophoneHandler from "./MicrophoneHandler";
import WebcamHandler from "./WebcamHandler";
import ScreenHandler from "./ScreenHandler";

/**
 * gvuvihbkhbvhkbbhk
 */
class App extends Component<any, any> {

  render() {
    return(
      <div>
        <MicrophoneHandler />
        <hr/>
        <WebcamHandler />
        <hr/>
        <ScreenHandler />
      </div>
    )
  }
}

export default App;