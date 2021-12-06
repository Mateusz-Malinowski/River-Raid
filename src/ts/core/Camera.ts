import Vector2 from "./Vector2"

export default class Camera {
  public width: number;
  public height: number;
  public position: Vector2;

  public constructor(width: number = 100, height: number = 100, position: Vector2 = new Vector2()) {
    this.width = width;
    this.height = height;
    this.position = position;
  }
}