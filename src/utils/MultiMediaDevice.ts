import WebcamMediaDevice from "./WebcamMediaDevice";
import MicrophoneMediaDevice from "./MicrophoneMediaDevice";
import ScreenMediaDevice from "./ScreenMediaDevice";
import { MediaDeviceType } from "./MediaDevice";
import MediaDeviceEventHandler from "./MediaDeviceEventHandler";

class MultiMediaDevice {

  private readonly webcam: WebcamMediaDevice;
  private readonly microphone: MicrophoneMediaDevice;
  private readonly screen: ScreenMediaDevice;
  private ready: { webcam: boolean, microphone: boolean, screen: boolean };

  private eventHandler: MediaDeviceEventHandler;


  public constructor(webcam: WebcamMediaDevice, microphone: MicrophoneMediaDevice, screen: ScreenMediaDevice) {
    this.webcam = webcam;
    this.microphone = microphone;
    this.screen = screen;
    this.ready = { webcam: false, microphone: false, screen: false };

    this.eventHandler = new MediaDeviceEventHandler();

    this.webcam.onAvailable(() => {
      this.setReady(true, MediaDeviceType.WEBCAM);
    });

    this.webcam.onUnavailable(() => {
      this.setReady(false, MediaDeviceType.WEBCAM);
    })

    this.webcam.onPermissionChange(async status => {
      if (status === "denied") {
        this.setReady(false, MediaDeviceType.WEBCAM);
      }
    });

    this.microphone.onAvailable(() => {
      this.setReady(true, MediaDeviceType.MICROPHONE);
    });

    this.microphone.onUnavailable(() => {
      this.setReady(false, MediaDeviceType.MICROPHONE);
    });

    this.microphone.onPermissionChange(async status => {
      if (status === "denied") {
        this.setReady(false, MediaDeviceType.MICROPHONE);
      }
    });

    this.screen.onAvailable(() => {
      this.setReady(true, MediaDeviceType.SCREEN);
    });

    this.screen.onUnavailable(() => {
      this.setReady(false, MediaDeviceType.SCREEN);
    });

    this.screen.onPermissionChange(async status => {
      if (status === "denied") {
        this.setReady(false, MediaDeviceType.SCREEN);
      }
    });
  }

  // Events
  public onReadyEvent(cb: () => void) {
    this.eventHandler.register(this.onReadyEvent, cb)
  }

  public onNotReadyEvent(cb: () => void) {
    this.eventHandler.register(this.onNotReadyEvent, cb)
  }

  public unregisterEvent(event: (...args: any[]) => void, cb: () => void) {
    this.eventHandler.unregister(event, cb);
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
  private setReady(ready: boolean, device: MediaDeviceType) {
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

    if(ready) {
      if (this.ready.webcam && this.ready.microphone && this.ready.screen) {
        this.eventHandler.emit(this.onReadyEvent);
      }
    } else {
      this.eventHandler.emit(this.onNotReadyEvent);
    }
  }
}

export default MultiMediaDevice;