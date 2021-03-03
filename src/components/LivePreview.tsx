import { Component } from "react";
import MultiMediaRecorder from "../utils/MultiMediaRecorder";
import MultiMediaDevice from "../utils/MultiMediaDevice";

interface Props {
  devices: MultiMediaDevice
  recorder: MultiMediaRecorder
}

interface State {
  timer: number
}

class LivePreview extends Component<Props, State> {

  private readonly devices: MultiMediaDevice = this.props.devices;
  private readonly recorder: MultiMediaRecorder = this.props.recorder;

  public state: State = {
    timer: 5
  }

  // Lifecycle
  public componentDidMount() {
    this.startTimer();
    this.previewRecording();
  }

  // Helpers
  public startTimer() {
    const intervalId = setInterval(() => {
      this.setState({
        timer: this.state.timer - 1
      });

      if (this.state.timer === 0) {
        clearInterval(intervalId);
        this.recorder.stop();
      }
    }, 1000);
  }

  private previewRecording() {
    const webcamVideo: HTMLVideoElement = document.getElementById("webcam-recording") as HTMLVideoElement;
    const screenVideo: HTMLVideoElement = document.getElementById("screen-recording") as HTMLVideoElement;

    const webcamLive: MediaStream = this.devices.getWebcam().getMediaStream();
    const screenLive: MediaStream = this.devices.getScreen().getMediaStream();

    webcamVideo.srcObject = webcamLive;
    screenVideo.srcObject = screenLive;
  }

  //Render
  public renderTimer() {
    return (
      <div>
        Time left: { this.state.timer }
      </div>
    )
  }

  public render() {
    return (
      <div>
        { this.renderTimer() }
        <video autoPlay={ true } height={ 360 } width={ 540 } id="webcam-recording"/>
        <video autoPlay={ true } height={ 360 } width={ 540 } id="screen-recording"/>
      </div>
    );
  }

}

export default LivePreview;