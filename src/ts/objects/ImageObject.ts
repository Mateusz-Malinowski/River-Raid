import Canvas from "../core/Canvas";
import CanvasObject from "../core/CanvasObject";

export default class ImageObject extends CanvasObject {
  public image: HTMLImageElement;
  public spriteX: number;
  public spriteY: number;
  public spriteWidth: number;
  public spriteHeight: number;
  public width: number;
  public height: number;

  public constructor(image: HTMLImageElement, spriteX: number, spriteY: number, spriteWidth: number, spriteHeight: number, width: number, height: number) {
    super();

    this.image = image;
    this.width = width;
    this.height = height;
    this.spriteX = spriteX;
    this.spriteY = spriteY;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
  }

  public draw(): void {
    Canvas.ctx.drawImage(this.image, this.spriteX, this.spriteY, this.spriteWidth, this.spriteHeight, this.realPosition.x, this.realPosition.y, this.width, this.height);
  }
}