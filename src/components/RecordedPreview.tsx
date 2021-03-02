import { Component } from "react";
import MultiMediaRecorder from "../utils/MultiMediaRecorder";

interface Props {
  recorder: MultiMediaRecorder
}

class RecordedPreview extends Component<Props, any> {

  private readonly recorder: MultiMediaRecorder = this.props.recorder;

  public componentDidMount() {
    if(this.recorder.isRecordingAvailable()) {
      this.setRecordings();
    } else {
      this.recorder.onFinish(this.setRecordings);
    }
  }

  public componentWillUnmount() {
    this.recorder.unregisterEvent(this.recorder.onFinish, this.setRecordings);
  }

  // Event
  private setRecordings = () => {
    const personVideo: HTMLVideoElement = document.getElementById("person-recording") as HTMLVideoElement;
    const screenVideo: HTMLVideoElement = document.getElementById("screen-recording") as HTMLVideoElement;

    const personRecording: Blob = this.recorder.getPersonRecording();
    const screenRecording: Blob = this.recorder.getScreenRecording();

    personVideo.src = URL.createObjectURL(personRecording);
    screenVideo.src = URL.createObjectURL(screenRecording);
  }

  public render() {
    return(
      <div>
        <video autoPlay={ false } controls={true} height={ 360 } width={ 540 } id="person-recording" />
        <video autoPlay={ false } controls={true} height={ 360 } width={ 540 } id="screen-recording" />
      </div>
    )
  }
}

export default RecordedPreview;