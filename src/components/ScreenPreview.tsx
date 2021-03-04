import { Component } from "react";
import WebcamMediaDevice from "../utils/WebcamMediaDevice";
import ScreenMediaDevice from "../utils/ScreenMediaDevice";

const SCREEN_ELEMENT_ID: string = "webcam-preview"

interface Props {
  screen: ScreenMediaDevice
}

class ScreenPreview extends Component<Props> {

  private screen: ScreenMediaDevice = this.props.screen;

  public componentDidMount() {
    const screenVisual: HTMLVideoElement = document.getElementById(SCREEN_ELEMENT_ID) as HTMLVideoElement;

    if(this.screen.hasStream())
      screenVisual.srcObject = this.screen.getMediaStream();

    this.screen.onAvailableEvent(this.showVideo);
    this.screen.onUnavailableEvent(this.hideVideo);
  }

  public componentWillUnmount() {
    this.screen.unregisterEvent(this.screen.onAvailableEvent, this.showVideo);
    this.screen.unregisterEvent(this.screen.onUnavailableEvent, this.hideVideo);
  }

  private showVideo = (stream: MediaStream)  => {
    const screenVisual: HTMLVideoElement = document.getElementById(SCREEN_ELEMENT_ID) as HTMLVideoElement;
    screenVisual.srcObject = stream;
  }

  private hideVideo = () => {
    const screenVisual: HTMLVideoElement = document.getElementById(SCREEN_ELEMENT_ID) as HTMLVideoElement;
    screenVisual.srcObject = null;
  }

  public render() {
    return <video autoPlay={ true } height={ 360 } width={ 540 } id={ SCREEN_ELEMENT_ID }/>;
  }
}

export default ScreenPreview;