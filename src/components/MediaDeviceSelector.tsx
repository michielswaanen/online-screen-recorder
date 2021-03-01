import { Component } from "react";
import WebcamMediaDevice from "../utils/WebcamMediaDevice";
import MicrophoneMediaDevice from "../utils/MicrophoneMediaDevice";

interface State {
  webcams: MediaDevices,
  microphones: MediaDevices,
}

interface Props {
  webcam: WebcamMediaDevice,
  microphone: MicrophoneMediaDevice,
}

type MediaDevices = {
  options: MediaDeviceInfo[],
  status: "awaiting" | "granted" | "denied"
}

class MediaDeviceSelector extends Component<Props, State> {

  private webcam: WebcamMediaDevice = this.props.webcam;
  private microphone: MicrophoneMediaDevice = this.props.microphone;

  public state: State = {
    webcams: { options: [], status: "awaiting" },
    microphones: { options: [], status: "awaiting" },
  }

  public async componentDidMount() {
    if(this.microphone.getPermission() === "granted") {
      const options = await this.microphone.options();
      this.setState({
        ...this.state,
        microphones: {
          status: "granted",
          options: options
        },
      });
    }

    if(this.webcam.getPermission() === "granted") {
      const options = await this.webcam.options();
      this.setState({
        ...this.state,
        webcams: {
          status: "granted",
          options: options
        },
      });
    }


    this.microphone.onPermissionEvent(async (status: "granted" | "denied") => {
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
          console.log("Something went wrong")
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
    });

    this.webcam.onPermissionEvent(async (status: "granted" | "denied") => {
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
          console.log("Something went wrong")
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
    });
  }

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

  public render() {
    return (
      <div>
        <div>
          { this.renderWebcamSelection() }
          { this.renderMicrophoneSelection() }
        </div>
      </div>
    )
  }
}

export default MediaDeviceSelector;