import WebcamMediaDevice from "./WebcamMediaDevice";
import MicrophoneMediaDevice from "./MicrophoneMediaDevice";
import MimeTypeGenerator from "./mimetype/MimeTypeGenerator";
import mimeTypes from "./mimetype/MimeTypes";
import MultiMediaDevice from "./MultiMediaDevice";
import ScreenMediaDevice from "./ScreenMediaDevice";
import MediaDeviceEventHandler from "./MediaDeviceEventHandler";


class MultiMediaRecorder {

  private readonly multiMediaDevice: MultiMediaDevice;
  private personRecorder: MediaRecorder;
  private screenRecorder: MediaRecorder;
  private recordings: { person: Blob | undefined, screen: Blob | undefined};

  private eventHandler: MediaDeviceEventHandler;

  // Events
  private onReadyCallback: { (): void }[];
  private onNotReadyCallback: { (): void }[];
  private onFinishCallback: { (personRecording: Blob, screenRecording: Blob): void }[];

  public constructor(multiMediaDevice: MultiMediaDevice) {
    this.multiMediaDevice = multiMediaDevice;
    this.recordings = { person: undefined, screen: undefined };
    this.eventHandler = new MediaDeviceEventHandler();

    const webcam: WebcamMediaDevice = this.multiMediaDevice.getWebcam();
    const microphone: MicrophoneMediaDevice = this.multiMediaDevice.getMicrophone();
    const screen: ScreenMediaDevice = this.multiMediaDevice.getScreen();

    this.onReadyCallback = [];
    this.onNotReadyCallback = [];
    this.onFinishCallback = [];

    this.multiMediaDevice.onReadyEvent(() => {
      const personStream = new MediaStream([webcam.getTrack(), microphone.getTrack()]);
      const screenStream = new MediaStream([screen.getTrack()]);
      const mimeType = this.getMimeType({ video: true, audio: true });

      this.personRecorder = new MediaRecorder(personStream, { mimeType: mimeType });
      this.screenRecorder = new MediaRecorder(screenStream)

      this.personRecorder.ondataavailable = (event: BlobEvent) => {
        this.recordings = {...this.recordings, person: event.data};
        this.emitReadyEvent();
      };

      this.screenRecorder.ondataavailable = (event: BlobEvent) => {
        this.recordings = {...this.recordings, screen: event.data};
        this.emitReadyEvent();
      };

      for (let callback of this.onReadyCallback) {
        callback()
      }
    });

    this.multiMediaDevice.onNotReadyEvent(() => {
      for (let callback of this.onNotReadyCallback) {
        callback()
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

  public onFinish(cb: (personRecording: Blob, screenRecording: Blob) => void) {
    this.onFinishCallback.push(cb);
  }

  // Functions
  public start(): void {
    this.personRecorder.start();
    this.screenRecorder.start();
  }

  public stop(): void {
    this.personRecorder.stop();
    this.screenRecorder.stop();
  }

  private getMimeType(query: { audio: boolean, video: boolean }): string {
    const generator = new MimeTypeGenerator();


    if (query.video) {
      const types: string[] = mimeTypes.video.types;
      const codecs: string[] = mimeTypes.video.types;

      return generator.findOptimalMimeType(types, codecs);
    }

    const types: string[] = mimeTypes.audio.types;
    const codecs: string[] = mimeTypes.audio.types;

    return generator.findOptimalMimeType(types, codecs);
  }

  private emitReadyEvent() {
    if(this.recordings.person !== undefined && this.recordings.screen !== undefined) {
      for (let callback of this.onFinishCallback) {
        callback(this.recordings.person, this.recordings.screen);
      }
    }
  }
}

export default MultiMediaRecorder;