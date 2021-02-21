import { Component } from "react";
import WebcamRecorder from "./utils/WebcamRecorder";

interface State {
  status: "awaiting" | "granted" | "denied"
  devices: { audio: MediaDeviceInfo[], video: MediaDeviceInfo[] }
}

class DevicePreview extends Component<any, any> {

  private webcam: WebcamRecorder = new WebcamRecorder();

  public state: State = {
    status: "awaiting",
    devices: {audio: [], video: []}
  }

  public componentDidMount() {
    this.webcam.askPermission();

    this.webcam.onPermissionChange(async (status: "granted" | "denied") => {
      if (status === "granted") {
        try {
          const devices = await this.webcam.getDeviceOptions();
          this.setState({
            devices: devices,
            status: "granted"
          });
        } catch (e) {
          this.setState({
            status: "denied"
          });
        }
      }
    });
  }

  public renderWebcam() {

  }

  public renderWebcamSelection() {
    if (this.state.status === "granted") {
      return <div>
        <select id="webcam-options"
                onChange={(e) => this.webcam.switchDevice(e.target.value, "video")}>
          { this.state.devices.video.map(device => {
            return <option value={ device.deviceId }>{ device.label }</option>
          }) }
        </select>
      </div>
    } else {
      return <div>
        Awaiting...
      </div>
    }
  }

  public renderMicrophoneSelection() {
    if(this.state.status === "granted" && this.webcam.isAudioEnabled()) {
      return <div>
        <select id="microphone-options"
                onChange={(e) => this.webcam.switchDevice(e.target.value, "audio")}>
          { this.state.devices.audio.map((device => {
            return <option value={ device.deviceId }>{ device.label }</option>
          })) }
        </select>
      </div>
    } else if (!this.webcam.isAudioEnabled()) {
      return <div>
        Microphone disabled
      </div>
    } else {
      return <div>
        Awaiting...
      </div>
    }
  }

  public render() {
    return (
      <div id="page-container" className="flex flex-col mx-auto w-full min-h-screen bg-gray-100">
        <main id="page-content" className="flex flex-auto flex-col max-w-full">

          <div className="max-w-10xl mx-auto p-10 lg:p-8 w-full">

            <div className="flex items-center justify-center rounded-lg bg-gray-50 border-2 text-gray-500 text-lg py-64">

            </div>

          </div>
        </main>

        <main id="page-content" className="flex flex-auto flex-col max-w-full">

          <div className="max-w-10xl mx-auto p-10 lg:p-8 w-full">

            <div className="flex items-center justify-center rounded-lg bg-gray-50 border-2 text-gray-500 text-lg py-64">
              { this.renderWebcamSelection()}
              { this.renderMicrophoneSelection()}
            </div>

          </div>
        </main>
      </div>
    )
  }
}

export default DevicePreview;