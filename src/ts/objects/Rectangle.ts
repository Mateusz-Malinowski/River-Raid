import Canvas from "../core/Canvas";
import CanvasObject from "../core/CanvasObject";

export default class Rectangle extends CanvasObject {
  public width: number;
  public height: number;

  public constructor(width: number, height: number) {
    super();

    this.width = width;
    this.height = height;
  }

  public draw(): void {
    Canvas.ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
  }
}