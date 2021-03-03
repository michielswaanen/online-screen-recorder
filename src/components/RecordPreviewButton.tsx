import { Component } from "react";
import MultiMediaRecorder from "../utils/MultiMediaRecorder";

interface Props {
  recorder: MultiMediaRecorder
}

interface State {
  started: boolean,
  allowed: boolean
}

class RecordPreviewButton extends Component<Props, State> {

  private readonly recorder: MultiMediaRecorder = this.props.recorder;

  public state: State = {
    started: false,
    allowed: false
  }

  public componentDidMount() {
    if(this.recorder.isReady()) {
      this.setButtonActive();
    }

    this.recorder.onReady(this.setButtonActive);
    this.recorder.onNotReady(this.setButtonInactive);
  }

  public componentWillUnmount() {
    this.recorder.unregisterEvent(this.recorder.onReady, this.setButtonActive);
    this.recorder.unregisterEvent(this.recorder.onNotReady, this.setButtonInactive);
  }

  // Callbacks
  private setButtonActive = () => {
    this.setState({ allowed: true });
  }

  private setButtonInactive = () => {
    this.setState({ allowed: false });
  }

  public renderButton() {
    if (!this.state.allowed) {
      return (
        <div>
          Waiting for acceptance
        </div>
      )
    }

    return (
      <button onClick={ () => {
        this.recorder.start();
        this.setState({ started: true });
      } } disabled={this.state.started}>
        Start Test
      </button>
    )
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