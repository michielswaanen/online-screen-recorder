import { Component } from "react";
import WebcamMediaDevice from "./utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "./utils/MicrophoneMediaDevice";
import SettingsPage from "./pages/SettingsPage";
import Record from "./Record";
import ScreenMediaDevice from "./utils/ScreenMediaDevice";
import MultiMediaDevice from "./utils/MultiMediaDevice";
import PermissionPage from "./pages/PermissionPage";

interface State {
  phase: "permission" | "settings" | "record" | "result"
}

class App extends Component<any, State> {

  private readonly webcam: WebcamMediaDevice = new WebcamMediaDevice();
  private readonly microphone: MicrophoneMediaDevice = new MicrophoneMediaDevice();
  private readonly screen: ScreenMediaDevice = new ScreenMediaDevice();
  private readonly devices: MultiMediaDevice = new MultiMediaDevice(this.webcam, this.microphone, this.screen);

  public state: State = {
    phase: "permission"
  }

  private continueCallback() {
    switch (this.state.phase) {
      case "permission":
        this.setState({phase: "settings"});
        break;
      case "settings":
        this.setState({phase: "record"});
        break;
      case "record":
        this.setState({phase: "result"});
        break;
      case "result":
        this.setState({phase: "permission"});
        break;
    }
  }

  public render() {
    switch (this.state.phase) {
      case "permission":
        return <PermissionPage devices={this.devices} continueCallback={this.continueCallback.bind(this)} />;
      case "settings":
        return <SettingsPage devices={this.devices} />;
      default:
        return <Record devices={this.devices} />
    }
  }
}

export default App;