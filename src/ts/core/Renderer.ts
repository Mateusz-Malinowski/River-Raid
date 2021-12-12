import Scene from "./Scene";

export default class Renderer {
  private scene: Scene;
  private beforeDrawing: (delta: number) => void;
  private afterDrawing: (delta: number) => void;
  private previousTimestamp: number = 0;

  public constructor(scene: Scene, beforeDrawing: (delta: number) => void, afterDrawing: (delta: number) => void) {
    this.scene = scene;
    this.beforeDrawing = beforeDrawing;
    this.afterDrawing = afterDrawing;
  }

  public startRendering(): void {
    this.render(0);
  }

  private render = (timestamp: number): void => {
    const delta = timestamp - this.previousTimestamp;
    
    this.beforeDrawing(delta);
    this.scene.draw();
    this.afterDrawing(delta);

    this.previousTimestamp = timestamp;
    requestAnimationFrame(this.render);
  }
}