import { Component } from "react";
import WebcamMediaDevice from "../utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "../utils/MicrophoneMediaDevice";
import MultiMediaDevice from "../utils/MultiMediaDevice";
import ScreenMediaDevice from "../utils/ScreenMediaDevice";

interface State {
  webcams: MediaDevices,
  microphones: MediaDevices,
  screens: { status: "awaiting" | "granted" | "denied" }
}

interface Props {
  devices: MultiMediaDevice,
}

type MediaDevices = {
  options: MediaDeviceInfo[],
  status: "awaiting" | "granted" | "denied"
}

class MediaDeviceSelector extends Component<Props, State> {

  private webcam: WebcamMediaDevice = this.props.devices.getWebcam();
  private microphone: MicrophoneMediaDevice = this.props.devices.getMicrophone();
  private screen: ScreenMediaDevice = this.props.devices.getScreen();

  // State
  public state: State = {
    webcams: { options: [], status: "awaiting" },
    microphones: { options: [], status: "awaiting" },
    screens: { status: "awaiting" },
  }

  // Lifecycle
  public async componentDidMount() {

    if (this.microphone.getPermission() === "granted") {
      await this.handleMicrophoneSelector("granted");
    }

    if (this.webcam.getPermission() === "granted") {
      await this.handleWebcamSelector("granted");
    }

    this.microphone.onPermissionEvent(this.handleMicrophoneSelector);
    this.webcam.onPermissionEvent(this.handleWebcamSelector);
  }

  public componentWillUnmount() {
    this.microphone.unregisterEvent(this.microphone.onPermissionEvent, this.handleMicrophoneSelector);
    this.webcam.unregisterEvent(this.webcam.onPermissionEvent, this.handleWebcamSelector);
  }

  // Events
  private handleWebcamSelector = async (status: "granted" | "denied") => {
    if (status === "granted") {
      try {
        const options = await this.webcam.options();
        this.setState({
          webcams: {
            status: "granted",
            options: options
          },
        });
      } catch (e) {
        throw new Error("Something went wrong while permission modification")
      }
    } else {
      this.setState({
        webcams: {
          status: "denied",
          options: []
        },
      });
    }
  }

  private handleMicrophoneSelector = async (status: "granted" | "denied") => {
    if (status === "granted") {
      try {
        const options = await this.microphone.options();
        this.setState({
          microphones: {
            status: "granted",
            options: options
          },
        });
      } catch (e) {
        throw new Error("Something went wrong while permission modification")
      }
    } else {
      this.setState({
        microphones: {
          status: "denied",
          options: []
        },
      });
    }
  }

  // Render
  public renderWebcamSelection() {
    if (this.state.webcams.status === "granted") {
      return <div>
        <select id="webcam-options"
                onChange={ (e) => this.webcam.select(e.target.value) }>
          { this.state.webcams.options.map(webcam => {
            return <option key={ webcam.deviceId } value={ webcam.deviceId }>{ webcam.label }</option>
          }) }
        </select>
      </div>
    } else if (this.state.webcams.status === "denied") {
      return <div>
        Webcam access denied
      </div>
    } else {
      return <div>
        Requesting webcam access...
      </div>
    }
  }

  public renderMicrophoneSelection() {
    if (this.state.microphones.status === "granted") {
      return <div>
        <select id="microphone-options"
                onChange={ (e) => this.microphone.select(e.target.value) }>
          { this.state.microphones.options.map((microphone => {
            return <option key={ microphone.deviceId } value={ microphone.deviceId }>{ microphone.label }</option>
          })) }
        </select>
      </div>
    } else if (this.state.microphones.status === "denied") {
      return <div>
        Microphone access denied
      </div>
    } else {
      return <div>
        Requesting microphone access...
      </div>
    }
  }

  public renderScreenSelection() {
    return (
      <div>
        <button onClick={async () => await this.screen.select()}>Change Screen</button>
      </div>
    )
  }

  public render() {
    return (
      <div>
        <div>
          { this.renderScreenSelection() }
          { this.renderWebcamSelection() }
          { this.renderMicrophoneSelection() }
        </div>
      </div>
    )
  }
}

export default MediaDeviceSelector;