import Canvas from "../core/Canvas";
import CanvasObject from "../core/CanvasObject";

export default class Text extends CanvasObject {
  public content: string;
  public color: string;
  public font: string;
  public textBaseline: CanvasTextBaseline;
  public textAlign: CanvasTextAlign;

  public constructor(content: string, color?: string, font?: string, textBaseline?: CanvasTextBaseline, textAlign?: CanvasTextAlign) {
    super();

    this.content = content;
    this.color = color;
    this.font = font;
    this.textBaseline = textBaseline;
    this.textAlign = textAlign;
  }

  public draw(): void {
    Canvas.ctx.fillStyle = this.color;
    Canvas.ctx.font = this.font;
    Canvas.ctx.textBaseline = this.textBaseline;
    Canvas.ctx.textAlign = this.textAlign;
    Canvas.ctx.fillText(this.content, this.position.x, this.position.y);
  }
}