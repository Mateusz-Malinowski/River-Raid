import Vector2 from "./Vector2";

export default class Canvas {
  private static element: HTMLCanvasElement;
  public static ctx: CanvasRenderingContext2D;
  public static width: number;
  public static height: number;

  public static create(width: number, height: number) {
    this.element = document.querySelector('#app-canvas')
    this.ctx = this.element.getContext('2d')
    this.width = width;
    this.height = height;
    this.element.width = width;
    this.element.height = height;
  }

  public static clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}