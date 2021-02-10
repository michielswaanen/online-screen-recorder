
class MimeTypeGenerator {

  public findOptimalMimeType(types: string[], codecs: string[]): string {
    const supportedTypes: string[] = [];

    types.forEach((type) => {
      const videoType = `video/${type}`;
      codecs.forEach((codec) => {
        const variations = [
          `${videoType};codecs=${codec}`,
          `${videoType};codecs:${codec}`,
          `${videoType};codecs=${codec.toUpperCase()}`,
          `${videoType};codecs:${codec.toUpperCase()}`,
          `${videoType}`
        ]
        variations.forEach(variation => {
          if(MediaRecorder.isTypeSupported(variation))
            supportedTypes.push(variation);
        });
      });
    });

    return supportedTypes[0];
  }

}

export default MimeTypeGenerator;