export default class Vector2 {
  public x: number;
  public y: number;

  public constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public copy(vector2?: Vector2): Vector2 {
    if (vector2) {
      this.x = vector2.x;
      this.y = vector2.y;
    }

    return this;
  }

  public set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public add(x: number, y: number): Vector2 {
    this.x += x;
    this.y += y;

    return this;
  }
}