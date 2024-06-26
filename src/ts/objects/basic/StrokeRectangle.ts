import Canvas from "../../core/Canvas";
import CanvasObject from "../../core/CanvasObject";

export default class StrokeRectangle extends CanvasObject {
  public strokeColor: string;
  public lineWidth: number;

  public constructor(width: number, height: number, strokeColor?: string, lineWidth?: number) {
    super();

    this.width = width;
    this.height = height;
    this.strokeColor = strokeColor;
    this.lineWidth = lineWidth;
  }

  public draw(): void {
    Canvas.ctx.strokeStyle = this.strokeColor;
    Canvas.ctx.lineWidth = this.lineWidth;
    Canvas.ctx.strokeRect(this.realPosition.x, this.realPosition.y, this.width, this.height);
  }
}