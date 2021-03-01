import { Component } from "react";
import MultiMediaRecorder from "./utils/MultiMediaRecorder";
import MultiMediaDevice from "./utils/MultiMediaDevice";

interface Props {
  devices: MultiMediaDevice
}


interface State {
  ready: boolean
}

class Record extends Component<Props, State> {

  private readonly devices: MultiMediaDevice = this.props.devices;
  private readonly recorder: MultiMediaRecorder = new MultiMediaRecorder(this.devices);

  public state: State = {
    ready: false
  }

  public componentDidMount() {

    this.recorder.onReady(() => {
      this.setState({ready: true});
    });

    this.recorder.onNotReady(() => {
      this.setState({ready: false});
    });

    this.recorder.onFinish((personRecording: Blob, screenRecording: Blob) => {
      const personVideo: HTMLVideoElement = document.getElementById("person-recording") as HTMLVideoElement;
      personVideo.srcObject = null;
      personVideo.src = URL.createObjectURL(personRecording);

      const screenVideo: HTMLVideoElement = document.getElementById("screen-recording") as HTMLVideoElement;
      screenVideo.srcObject = null;
      screenVideo.src = URL.createObjectURL(screenRecording);
    });
  }

  public render() {
    return (
      <div>
        <video autoPlay={ false } controls height={ 360 } width={ 540 } id="person-recording"/>
        <video autoPlay={ false } controls height={ 360 } width={ 540 } id="screen-recording"/>
        <button onClick={ this.recorder.start.bind(this.recorder) } disabled={!this.state.ready}>Start Recording</button>
        <button onClick={ this.recorder.stop.bind(this.recorder) } disabled={!this.state.ready}>Stop Recording</button>
      </div>
    )
  }
}

export default Record;