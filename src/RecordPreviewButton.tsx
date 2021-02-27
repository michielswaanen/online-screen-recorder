import { Component } from "react";
import WebcamRecorder from "./utils/WebcamRecorder";
import WebcamMediaDevice from "./utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "./utils/MicrophoneMediaDevice";

interface Props {
  webcam: WebcamMediaDevice
  microphone: MicrophoneMediaDevice
}

interface State {
  started: boolean,
  allowed: boolean
}

class RecordPreviewButton extends Component<Props, State> {

  private webcam: WebcamMediaDevice = this.props.webcam;
  private microphone: MicrophoneMediaDevice = this.props.microphone;

  public state: State = {
    started: false,
    allowed: false
  }

  public componentDidMount() {

    this.webcam.onAvailable(() => {
      console.log("BUTTON AVAILABLE CALLED")
      if (this.microphone.getPermission() === "granted") {
        this.setState({ allowed: true });
      }
    });

    this.webcam.onUnavailable(() => {
      this.setState({ allowed: false });
    })

    this.microphone.onAvailable(() => {
      if (this.webcam.getPermission() === "granted") {
        this.setState({ allowed: true });
      }
    });

    this.microphone.onUnavailable(() => {
      this.setState({ allowed: false });
    })
  }

  public renderButton() {
    if (!this.state.allowed) {
      return (
        <div>
          Waiting for acceptance
        </div>
      )
    }

    const combined: MediaStream = new MediaStream([this.webcam.getTrack(), this.microphone.getTrack()]);
    const recording: MediaRecorder = new MediaRecorder(combined);


    if (this.state.started) {
      return (
        <button onClick={ () => {
          recording.stop();
          this.setState({ started: false });
        } }>
          Stop Test
        </button>
      )
    } else {
      return (
        <button onClick={ () => {
          recording.start();
          this.setState({ started: true });
        } }>
          Start Test
        </button>
      )
    }
  }

  public render() {
    return (
      <div>
        { this.renderButton() }
      </div>
    )
  }
}

export default RecordPreviewButton;