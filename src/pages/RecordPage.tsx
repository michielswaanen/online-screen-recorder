import { Component } from "react";
import MultiMediaRecorder from "../utils/MultiMediaRecorder";
import MultiMediaDevice from "../utils/MultiMediaDevice";

interface Props {
  devices: MultiMediaDevice
  continueCallback: () => void
}

interface State {
  ready: boolean,
  recorded: boolean
}

class RecordPage extends Component<Props, State> {

  private readonly devices: MultiMediaDevice = this.props.devices;
  private readonly recorder: MultiMediaRecorder = new MultiMediaRecorder(this.devices);

  public state: State = {
    ready: false,
    recorded: false
  }

  public componentDidMount() {
    if (this.recorder.isReady())
      this.enableRecordButton();

    this.recorder.onReady(this.enableRecordButton);
    this.recorder.onNotReady(this.disableRecordButton);
    this.recorder.onStart(this.showLivePreview);
    this.recorder.onStop(this.showResult);
    this.recorder.onFinish(this.showRecordingResult);
  }

  public componentWillUnmount() {
    this.recorder.unregisterEvent(this.recorder.onReady, this.enableRecordButton);
    this.recorder.unregisterEvent(this.recorder.onNotReady, this.disableRecordButton);
    this.recorder.unregisterEvent(this.recorder.onStart, this.showLivePreview);
    this.recorder.unregisterEvent(this.recorder.onStop, this.showResult);
    this.recorder.unregisterEvent(this.recorder.onFinish, this.showRecordingResult);
  }

  // Events
  private enableRecordButton = () => {
    this.setState({ ready: true });
  }

  private disableRecordButton = () => {
    this.setState({ ready: false });
  }

  private showResult = () => {
    this.setState({recorded: true})
  }

  private continueToNextPage = () => {
    this.props.continueCallback();
  }

  private showLivePreview = (webcam: MediaStream, screen: MediaStream) => {
    const webcamVideo: HTMLVideoElement = document.getElementById("webcam-live") as HTMLVideoElement;
    webcamVideo.srcObject = webcam;

    const screenVideo: HTMLVideoElement = document.getElementById("screen-live") as HTMLVideoElement;
    screenVideo.srcObject = screen;
  }

  private showRecordingResult = (webcam: Blob, screen: Blob) => {
    const webcamVideo: HTMLVideoElement = document.getElementById("person-recording") as HTMLVideoElement;
    webcamVideo.srcObject = null;
    webcamVideo.src = URL.createObjectURL(webcam);

    const screenVideo: HTMLVideoElement = document.getElementById("screen-recording") as HTMLVideoElement;
    screenVideo.srcObject = null;
    screenVideo.src = URL.createObjectURL(screen);
  }

  public renderRecordingLive() {
    return (
      <div>
        Live:
        <video autoPlay={ true } height={ 360 } width={ 540 } id="webcam-live"/>
        <video autoPlay={ true } height={ 360 } width={ 540 } id="screen-live"/>
        <button onClick={ this.recorder.start } disabled={ !this.state.ready }>
          Start Recording
        </button>
        <button onClick={ this.recorder.stop } disabled={ !this.state.ready }>
          Stop Recording
        </button>
      </div>
    )
  }

  public renderRecordingResult() {
    return (
      <div>
        Recorded:
        <video autoPlay={ false } controls height={ 360 } width={ 540 } id="person-recording"/>
        <video autoPlay={ false } controls height={ 360 } width={ 540 } id="screen-recording"/>
        <button onClick={ this.continueToNextPage }>
          Record again
        </button>
        <button>
          Upload
        </button>
      </div>
    )
  }

  // Render
  public render() {
    if (this.state.recorded) {
      return this.renderRecordingResult();
    } else {
      return this.renderRecordingLive();
    }
  }
}

export default RecordPage;