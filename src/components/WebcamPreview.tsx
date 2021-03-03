import { Component } from "react";
import WebcamMediaDevice from "../utils/WebcamMediaDevice";

const WEBCAM_ELEMENT_ID: string = "webcam-preview"

interface Props {
  webcam: WebcamMediaDevice
}

class WebcamPreview extends Component<Props> {

  private webcam: WebcamMediaDevice = this.props.webcam;

  public componentDidMount() {
    const webcamVisual: HTMLVideoElement = document.getElementById(WEBCAM_ELEMENT_ID) as HTMLVideoElement;

    if(this.webcam.hasStream())
      webcamVisual.srcObject = this.webcam.getMediaStream();

    this.webcam.onAvailableEvent(this.showVideo);
    this.webcam.onUnavailableEvent(this.hideVideo);
  }

  public componentWillUnmount() {
    this.webcam.unregisterEvent(this.webcam.onAvailableEvent, this.showVideo);
    this.webcam.unregisterEvent(this.webcam.onUnavailableEvent, this.hideVideo);
  }

  private showVideo = (stream: MediaStream)  => {
    const webcamVisual: HTMLVideoElement = document.getElementById(WEBCAM_ELEMENT_ID) as HTMLVideoElement;
    webcamVisual.srcObject = stream;
  }

  private hideVideo = () => {
    const webcamVisual: HTMLVideoElement = document.getElementById(WEBCAM_ELEMENT_ID) as HTMLVideoElement;
    webcamVisual.srcObject = null;
  }

  public render() {
    return <video autoPlay={ true } height={ 360 } width={ 540 } id={ WEBCAM_ELEMENT_ID }/>;
  }
}

export default WebcamPreview;