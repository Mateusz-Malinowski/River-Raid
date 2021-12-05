import Assets from "../core/Assets";
import Canvas from "../core/Canvas";
import CanvasObject from "../core/CanvasObject";

export default class ImageObject extends CanvasObject {
  public width: number;
  public height: number;

  public constructor(width: number, height: number) {
    super();

    this.width = width;
    this.height = height;
  }

  public draw(): void {
    Canvas.ctx.drawImage(Assets.images.activision, this.position.x, this.position.y, this.width, this.height);
  }
}