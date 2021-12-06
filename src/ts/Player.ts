import Keyboard from "./core/Keyboard";
import Vector2 from "./core/Vector2";
import Plane from "./objects/image-objects/player/Plane";
import PlaneLeft from "./objects/image-objects/player/PlaneLeft";
import PlaneRight from "./objects/image-objects/player/PlaneRight";
import ImageObject from "./objects/ImageObject";

export default class Player {
  private position: Vector2 = new Vector2();
  private velocityX: number;
  private velocityY: number;
  private minVelocityY: number;
  private maxVelocityY: number;
  private accelerationRate: number;
  private basePlaneWidth: number = 80;
  private basePlaneHeight: number = 80;
  private rolledPlaneWidth: number = 60;
  private rolledPlaneHeight: number = 84;
  public object: ImageObject = new Plane(this.basePlaneWidth, this.basePlaneHeight);

  public constructor(minVelocityY: number, maxVelocityY: number, velocityX: number, velocityY: number, accelerationRate: number) {
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.minVelocityY = minVelocityY;
    this.maxVelocityY = maxVelocityY;
    this.accelerationRate = accelerationRate;
    this.alignObjectPosition();
  }

  public setPosition(vector2: Vector2): void {
    this.position.set(vector2.x, vector2.y);
    this.alignObjectPosition();
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  public render(delta: number): void {
    this.handleControls(delta);

    const pos = this.position.copy();
    this.setPosition(pos.add(0, -this.velocityY * delta));
  }

  private handleControls(delta: number): void {
    this.handleLeftRight(delta);

    if (Keyboard.isPressed('ArrowUp') && this.velocityY != this.maxVelocityY) {
      this.velocityY += this.accelerationRate * delta;
      if (this.velocityY > this.maxVelocityY) this.velocityY = this.maxVelocityY;
    }

    if (Keyboard.isPressed('ArrowDown') && this.velocityY != this.minVelocityY) {
      this.velocityY -= this.accelerationRate * delta;
      if (this.velocityY < this.minVelocityY) this.velocityY = this.minVelocityY;
    }
  }
  
  private handleLeftRight(delta: number): void {
    if (!Keyboard.isPressed('ArrowRight') && !Keyboard.isPressed('ArrowLeft')) {
      this.object = new Plane(this.basePlaneWidth, this.basePlaneHeight);
      return;
    }

    if (Keyboard.isPressed('ArrowRight')) {
      this.object = new PlaneRight(this.rolledPlaneWidth, this.rolledPlaneHeight);
      const pos = this.position.copy();
      this.setPosition(pos.add(this.velocityX * delta, 0));
    }
    else if (Keyboard.isPressed('ArrowLeft')) {
      this.object = new PlaneLeft(this.rolledPlaneWidth, this.rolledPlaneHeight);
      const pos = this.position.copy();
      this.setPosition(pos.add(-this.velocityX * delta, 0));
    }
  }

  private alignObjectPosition(): void {
    this.object.position.set(this.position.x - this.object.width / 2, this.position.y)
  }
}