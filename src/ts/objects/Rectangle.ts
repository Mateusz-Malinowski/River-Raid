import Canvas from "../core/Canvas";
import CanvasObject from "../core/CanvasObject";

export default class Rectangle extends CanvasObject {
  public width: number;
  public height: number;
  public backgroundColor: string;

  public constructor(width: number, height: number, backgroundColor: string) {
    super();

    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;
  }

  public draw(): void {
    Canvas.ctx.fillStyle = this.backgroundColor;
    Canvas.ctx.fillRect(this.realPosition.x, this.realPosition.y, this.width, this.height);
  }
}