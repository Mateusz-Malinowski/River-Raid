import Canvas from "../core/Canvas";
import CanvasObject from "../core/CanvasObject";

export default class ImageObject extends CanvasObject {
  public image: HTMLImageElement;
  public width: number;
  public height: number;

  public constructor(image: HTMLImageElement, width: number, height: number) {
    super();

    this.image = image;
    this.width = width;
    this.height = height;
  }

  public draw(): void {
    Canvas.ctx.drawImage(this.image, this.realPosition.x, this.realPosition.y, this.width, this.height);
  }
}