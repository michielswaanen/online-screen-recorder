import WebcamMediaDevice from "./WebcamMediaDevice";
import MicrophoneMediaDevice from "./MicrophoneMediaDevice";
import ScreenMediaDevice from "./ScreenMediaDevice";
import { MediaDeviceType } from "./MediaDevice";

class MultiMediaDevice {

  private readonly webcam: WebcamMediaDevice;
  private readonly microphone: MicrophoneMediaDevice;
  private readonly screen: ScreenMediaDevice;
  private ready: { webcam: boolean, microphone: boolean, screen: boolean };

  private onReadyCallback: { (): void }[];
  private onNotReadyCallback: { (): void }[];

  public constructor(webcam: WebcamMediaDevice, microphone: MicrophoneMediaDevice, screen: ScreenMediaDevice) {
    this.webcam = webcam;
    this.microphone = microphone;
    this.screen = screen;
    this.ready = { webcam: false, microphone: false, screen: false };

    this.onReadyCallback = [];
    this.onNotReadyCallback = [];

    this.webcam.onAvailable(() => {
      console.log("WEBCAM AVAILABLE")
      this.setReady(true, MediaDeviceType.WEBCAM, this.onReadyCallback);
    });

    this.webcam.onUnavailable(() => {
      this.setReady(false, MediaDeviceType.WEBCAM, this.onNotReadyCallback);
    })

    this.webcam.onPermissionChange(async status => {
      console.log("WEBCAM PERMISSION CHANGE RECEIVED TO ", status);
      if (status === "denied") {
        this.setReady(false, MediaDeviceType.WEBCAM, this.onNotReadyCallback);
      }
    });

    this.microphone.onAvailable(() => {
      console.log("MIC AVAILABLE")
      this.setReady(true, MediaDeviceType.MICROPHONE, this.onReadyCallback);
    });

    this.microphone.onUnavailable(() => {
      this.setReady(false, MediaDeviceType.MICROPHONE, this.onNotReadyCallback);
    });

    this.microphone.onPermissionChange(async status => {
      if (status === "denied") {
        this.setReady(false, MediaDeviceType.MICROPHONE, this.onNotReadyCallback);
      }
    });

    this.screen.onAvailable(() => {
      console.log("SCREEN AVAILABLE")
      this.setReady(true, MediaDeviceType.SCREEN, this.onReadyCallback);
    });

    this.screen.onUnavailable(() => {
      this.setReady(false, MediaDeviceType.SCREEN, this.onNotReadyCallback);
    });

    this.screen.onPermissionChange(async status => {
      if (status === "denied") {
        this.setReady(false, MediaDeviceType.SCREEN, this.onNotReadyCallback);
      }
    });
  }

  // Events
  public onReady(cb: () => void) {
    this.onReadyCallback.push(cb);
  }

  public onNotReady(cb: () => void) {
    this.onNotReadyCallback.push(cb);
  }

  // Getters
  public getWebcam(): WebcamMediaDevice {
    return this.webcam;
  }

  public getMicrophone(): MicrophoneMediaDevice {
    return this.microphone;
  }

  public getScreen(): ScreenMediaDevice {
    return this.screen;
  }

  public areReady(): boolean {
    return this.screen.hasStream() && this.microphone.hasStream() && this.webcam.hasStream();
  }

  // Setters
  private setReady(ready: boolean, device: MediaDeviceType, callbacks: { (): void }[]) {
    switch (device) {
      case MediaDeviceType.WEBCAM:
        this.ready = { ...this.ready, webcam: ready };
        break;
      case MediaDeviceType.MICROPHONE:
        this.ready = { ...this.ready, microphone: ready };
        break;
      case MediaDeviceType.SCREEN:
        this.ready = { ...this.ready, screen: ready };
        break;
      default:
        throw new Error('MediaDeviceType not yet supported in MultiMediaDevice')
    }

    console.log("DEVICE STATUS READY:")
    console.log(this.ready);

    if (this.ready.webcam && this.ready.microphone && this.ready.screen) {
      for (let callback of callbacks) {
        callback();
      }
    }
  }
}

export default MultiMediaDevice;