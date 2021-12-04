import Scene from "./Scene";

export default class Renderer {
  private scene: Scene;
  private onRender: (delta: number) => void;
  private previousTimestamp: number = 0;

  public constructor(scene: Scene, onRender: (delta: number) => void) {
    this.scene = scene;
    this.onRender = onRender;
  }

  public startRendering(): void {
    this.render(0);
  }

  private render = (timestamp: number): void => {
    const delta = timestamp - this.previousTimestamp;
    
    this.onRender(delta);
    this.scene.draw();

    this.previousTimestamp = timestamp;
    requestAnimationFrame(this.render);
  }
}