import Canvas from "../../core/Canvas";
import CanvasObject from "../../core/CanvasObject";
import Vector2 from "../../core/Vector2";

export default class QuadraticCurve extends CanvasObject {
  public vector: Vector2;
  public controlPointPosition: Vector2;
  public lineWidth: number;
  public color: string;

  public constructor(vector: Vector2, controlPointPosition: Vector2, lineWidth?: number, color?: string) {
    super();

    this.vector = vector;
    this.controlPointPosition = controlPointPosition;
    this.lineWidth = lineWidth;
    this.color = color;
  }

  public draw(): void {
    Canvas.ctx.lineWidth = this.lineWidth;
    Canvas.ctx.strokeStyle = this.color;
    Canvas.ctx.beginPath();
    Canvas.ctx.moveTo(this.realPosition.x, this.realPosition.y);
    Canvas.ctx.quadraticCurveTo(
      this.controlPointPosition.x,
      this.controlPointPosition.y,
      this.realPosition.x + this.vector.x,
      this.realPosition.y + this.vector.y
    );
    Canvas.ctx.stroke();
  }
}