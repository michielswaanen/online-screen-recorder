import { Component } from "react";
import MultiMediaRecorder from "../utils/MultiMediaRecorder";
import MultiMediaDevice from "../utils/MultiMediaDevice";

interface Props {
  devices: MultiMediaDevice
}

interface State {
  started: boolean,
  allowed: boolean
}

class RecordPreviewButton extends Component<Props, State> {

  private readonly multiMediaDevice: MultiMediaDevice = this.props.devices;
  private readonly recorder: MultiMediaRecorder = new MultiMediaRecorder(this.multiMediaDevice);

  public state: State = {
    started: false,
    allowed: false
  }

  public componentDidMount() {
    this.recorder.onReady(() => {
      this.setState({ allowed: true });
    });

    this.recorder.onNotReady(() => {
      this.setState({ allowed: false });
    });

    this.recorder.onFinish(recording => {
      const video: HTMLVideoElement = document.getElementById("recording") as HTMLVideoElement;
      video.srcObject = null;
      video.src = URL.createObjectURL(recording);
    });
  }

  public renderButton() {
    if (!this.state.allowed) {
      return (
        <div>
          Waiting for acceptance
        </div>
      )
    }

    if (this.state.started) {
      return (
        <button onClick={ () => {
          this.recorder.stop();
          this.setState({ started: false });
        } }>
          Stop Test
        </button>
      )
    } else {
      return (
        <button onClick={ () => {
          this.recorder.start();
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