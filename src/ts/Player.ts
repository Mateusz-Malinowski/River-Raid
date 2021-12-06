import Vector2 from "./core/Vector2";
import ImageObject from "./objects/ImageObject";

export default class Player {
  private position: Vector2 = new Vector2();
  public velocity: number;
  public object: ImageObject;

  public constructor(velocity: number, object: ImageObject) {
    this.velocity = velocity;
    this.object = object;
    this.alignObjectPosition();
  }

  public setPosition(vector2: Vector2): void {
    this.position.set(vector2.x, vector2.y);
    this.alignObjectPosition();
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  private alignObjectPosition(): void {
    this.object.position.set(this.position.x - this.object.width / 2, this.position.y - this.object.height / 2)
  }
}