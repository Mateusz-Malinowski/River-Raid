type LoadedImages = { [key: string]: HTMLImageElement }
type imagesToLoad = { [key: string]: string }

export default class Assets {
  public static images: LoadedImages = {};
  private static paths: imagesToLoad = {
    activision: new URL('../../assets/activision.png', import.meta.url).pathname,
  };

  public static async loadImages(): Promise<void> {
    return new Promise((resolve) => {
      for (const [alias, url] of Object.entries(this.paths)) {
        const image = new Image();
        image.src = url;
        image.addEventListener('load', () => {
          this.images[alias] = image;

          if (Object.entries(this.images).length == Object.entries(this.paths).length)
            resolve();
        });
      }
    });
  }
}