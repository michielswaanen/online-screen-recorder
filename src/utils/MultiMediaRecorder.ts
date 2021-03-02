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

  public constructor(multiMediaDevice: MultiMediaDevice) {
    this.multiMediaDevice = multiMediaDevice;
    this.recordings = { person: undefined, screen: undefined };
    this.eventHandler = new MediaDeviceEventHandler();

    const webcam: WebcamMediaDevice = this.multiMediaDevice.getWebcam();
    const microphone: MicrophoneMediaDevice = this.multiMediaDevice.getMicrophone();
    const screen: ScreenMediaDevice = this.multiMediaDevice.getScreen();

    this.multiMediaDevice.onReadyEvent(() => {
      const personStream = new MediaStream([webcam.getTrack(), microphone.getTrack()]);
      const screenStream = new MediaStream([screen.getTrack()]);
      const mimeType = this.getMimeType({ video: true, audio: true });

      this.personRecorder = new MediaRecorder(personStream, { mimeType: mimeType });
      this.screenRecorder = new MediaRecorder(screenStream)

      this.personRecorder.ondataavailable = (event: BlobEvent) => {
        this.recordings = {...this.recordings, person: event.data};

        if(this.recordings.screen) {
          this.eventHandler.emit(this.onFinish, this.recordings.person, this.recordings.screen);
        }
      };

      this.screenRecorder.ondataavailable = (event: BlobEvent) => {
        this.recordings = {...this.recordings, screen: event.data};
        if(this.recordings.person) {
          this.eventHandler.emit(this.onFinish, this.recordings.person, this.recordings.screen);
        }
      };
      this.eventHandler.emit(this.onReady)
    });

    this.multiMediaDevice.onNotReadyEvent(() => {
      this.eventHandler.emit(this.onNotReady);
    });
  }

  // Events
  public onReady(cb: () => void) {
    this.eventHandler.register(this.onReady, cb);
  }

  public onNotReady(cb: () => void) {
    this.eventHandler.register(this.onNotReady, cb);
  }

  public onFinish(cb: (personRecording: Blob, screenRecording: Blob) => void) {
    this.eventHandler.register(this.onFinish, cb);
  }

  public onStart(cb: (webcam: MediaStream, screen: MediaStream) => void) {
    this.eventHandler.register(this.onStart, cb);
  }

  public onStop(cb: () => void) {
    this.eventHandler.register(this.onStop, cb);
  }

  public unregisterEvent(event: (...args: any[]) => void, cb: (...args: any[]) => void) {
    this.eventHandler.unregister(event, cb);
  }

  // Functions
  public start(): void {
    this.personRecorder.start();
    this.screenRecorder.start();

    const webcam: MediaStream = this.multiMediaDevice.getWebcam().getMediaStream();
    const screen: MediaStream = this.multiMediaDevice.getScreen().getMediaStream();

    this.eventHandler.emit(this.onStart, webcam, screen);
  }

  public stop(): void {
    this.personRecorder.stop();
    this.screenRecorder.stop();
    this.eventHandler.emit(this.onStop);
  }

  public reset(): void {
    this.recordings = {person: undefined, screen: undefined};
  }

  public getPersonRecording(): Blob {
    if(this.recordings.person === undefined)
      throw new Error("No recording of person available");

    return this.recordings.person;
  }

  public getScreenRecording(): Blob {
    if(this.recordings.screen === undefined)
      throw new Error("No recording of screen available");

    return this.recordings.screen;
  }

  public isRecordingAvailable(): boolean {
    return this.recordings.screen !== undefined && this.recordings.person !== undefined;
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
}

export default MultiMediaRecorder;