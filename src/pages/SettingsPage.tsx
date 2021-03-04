import { Component } from "react";
import WebcamPreview from "../components/WebcamPreview";
import MediaDeviceSelector from "../components/MediaDeviceSelector";
import RecordPreviewButton from "../components/RecordPreviewButton";
import WebcamMediaDevice from "../utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "../utils/MicrophoneMediaDevice";
import MultiMediaDevice from "../utils/MultiMediaDevice";
import MultiMediaRecorder from "../utils/MultiMediaRecorder";
import RecordedPreview from "../components/RecordedPreview";
import LivePreview from "../components/LivePreview";
import ScreenPreview from "../components/ScreenPreview";
import ScreenMediaDevice from "../utils/ScreenMediaDevice";

interface Props {
  devices: MultiMediaDevice
  continueCallback: () => void
}

interface State {
  phase: "setup" | "recording" | "result"
}

class SettingsPage extends Component<Props, State> {

  public readonly devices = this.props.devices;
  private readonly recorder: MultiMediaRecorder = new MultiMediaRecorder(this.devices);

  public state: State = {
    phase: "setup"
  }

  // Lifecycle
  public componentDidMount() {
    this.recorder.onStart(this.showLivePreview);
    this.recorder.onStop(this.showRecordedPreview);
  }

  public componentWillUnmount() {
    this.recorder.unregisterEvent(this.recorder.onStart, this.showLivePreview);
    this.recorder.unregisterEvent(this.recorder.onStop, this.showRecordedPreview);
  }

  // Callbacks
  private showSettings = () => {
    this.recorder.reset();
    this.setState({phase: "setup"});
  }

  private showLivePreview = () => {
    this.setState({phase: "recording"});
  }

  private showRecordedPreview = () => {
    this.setState({phase: "result"});
  }

  private continueCallback = () => {
    this.props.continueCallback();
  }

  // Render
  public renderSetup() {
    const webcam: WebcamMediaDevice = this.devices.getWebcam();
    const screen: ScreenMediaDevice = this.devices.getScreen();

    return(
      <div>
        <WebcamPreview webcam={ webcam }/>
        <ScreenPreview screen={ screen }/>
        <MediaDeviceSelector devices={this.devices}/>
        <RecordPreviewButton recorder={this.recorder} />
      </div>
    )

  }

  public renderLivePreview() {
    return (
      <div>
        <LivePreview devices={this.devices} recorder={this.recorder} />
      </div>
    )
  }

  public renderRecordedPreview() {
    return (
      <div>
        <RecordedPreview recorder={this.recorder} />
        <button onClick={this.showSettings}>Change settings</button>
        <button onClick={this.continueCallback}>Next! Start Recording</button>
      </div>
    );
  }


  public render() {
    switch (this.state.phase) {
      case "setup":
        return this.renderSetup();
      case "recording":
        return this.renderLivePreview();
      case "result":
        return this.renderRecordedPreview()
    }
  }
}

export default SettingsPage;
