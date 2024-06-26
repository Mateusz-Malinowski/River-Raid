import Canvas from "../../core/Canvas";
import CanvasObject from "../../core/CanvasObject";
import Vector2 from "../../core/Vector2";

export default class Line extends CanvasObject {
  public vector: Vector2;
  public lineWidth: number;

  public constructor(vector: Vector2, lineWidth?: number) {
    super();

    this.vector = vector;
    this.lineWidth = lineWidth;
  }

  public draw(): void {
    Canvas.ctx.lineWidth = this.lineWidth;
    Canvas.ctx.beginPath();
    Canvas.ctx.moveTo(this.realPosition.x, this.realPosition.y);
    Canvas.ctx.lineTo(this.realPosition.x + this.vector.x, this.realPosition.y + this.vector.y);
    Canvas.ctx.stroke();
  }
}