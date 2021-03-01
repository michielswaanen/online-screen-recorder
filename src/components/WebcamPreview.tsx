import { Component } from "react";
import WebcamMediaDevice from "../utils/WebcamMediaDevice";

const WEBCAM_ELEMENT_ID: string = "webcam-preview"

interface Props {
  webcam: WebcamMediaDevice
}

class WebcamPreview extends Component<Props> {

  public componentDidMount() {
    const webcam: WebcamMediaDevice = this.props.webcam;
    const webcamVisual: HTMLVideoElement = document.getElementById(WEBCAM_ELEMENT_ID) as HTMLVideoElement;

    if(webcam.hasStream()) {
      webcamVisual.srcObject = webcam.getMediaStream();
    }

    webcam.onAvailable((stream: MediaStream) => {
      webcamVisual.srcObject = stream;
    });

    webcam.onUnavailable(() => {
      webcamVisual.srcObject = null;
    });
  }

  public render() {
    return <video autoPlay={ true } height={ 360 } width={ 540 } id={ WEBCAM_ELEMENT_ID }/>;
  }
}

export default WebcamPreview;