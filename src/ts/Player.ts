import Keyboard from "./core/Keyboard";
import Vector2 from "./core/Vector2";
import Plane from "./objects/image-objects/player/Plane";
import PlaneLeft from "./objects/image-objects/player/PlaneLeft";
import PlaneRight from "./objects/image-objects/player/PlaneRight";
import ImageObject from "./objects/ImageObject";
import PlayerBullet from "./PlayerBullet";

enum DirectionX {
  None,
  Left,
  Right
}

export default class Player {
  private position: Vector2 = new Vector2();
  private isStopped: boolean = true;
  private velocityX: number = 0;
  private maxVelocityX: number = 0.8;
  private directionX: DirectionX;
  private velocityY: number = 0;
  private minVelocityY: number = 0.2;
  private baseVelocityY: number = 0.4;
  private maxVelocityY: number = 0.8;
  private accelerationRateY: number = 0.001;
  private accelerationRateX: number = 0.002;
  private basePlaneWidth: number = 105;
  private basePlaneHeight: number = 105;
  private rolledPlaneWidth: number = 75;
  private rolledPlaneHeight: number = 105;
  private bulletWidth: number = 14;
  private bulletHeight: number = 56;
  private bulletsPerSecond: number = 3;
  private secondsFromPreviousBullet: number = 1 / this.bulletsPerSecond; // player can fire on start

  public bullets: PlayerBullet[] = [];
  public object: ImageObject = new Plane(this.basePlaneWidth, this.basePlaneHeight);

  public constructor() {
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
    if (this.isStopped) {
      if (
        Keyboard.isPressed('ArrowDown') || Keyboard.isPressed('ArrowUp') || 
        Keyboard.isPressed('ArrowLeft') || Keyboard.isPressed('ArrowRight') ||
        Keyboard.isPressed(' ')
      ) {
        this.isStopped = false;
      }
      else
        return;
    }
    
    this.handleControls(delta);
    this.updatePosition(delta);
    this.updateBullets(delta);
  }

  private alignObjectPosition(): void {
    this.object.position.set(this.position.x - this.object.width / 2, this.position.y - this.object.height / 2)
  }

  private handleControls(delta: number): void {
    this.handleLeftRight(delta);
    this.handleVelocity(delta);
    this.handleShooting();
  }

  private handleLeftRight(delta: number): void {
    if (!Keyboard.isPressed('ArrowRight') && !Keyboard.isPressed('ArrowLeft')) {
      this.object = new Plane(this.basePlaneWidth, this.basePlaneHeight);
      this.velocityX = 0;
      this.directionX = DirectionX.None;
      return;
    }

    this.velocityX += this.accelerationRateX * delta;
    if (this.velocityX > this.maxVelocityX) this.velocityX = this.maxVelocityX;

    if (Keyboard.isPressed('ArrowRight')) {
      this.object = new PlaneRight(this.rolledPlaneWidth, this.rolledPlaneHeight);
      this.directionX = DirectionX.Right;
      return;
    }

    if (Keyboard.isPressed('ArrowLeft')) {
      this.object = new PlaneLeft(this.rolledPlaneWidth, this.rolledPlaneHeight);
      this.directionX = DirectionX.Left;
      return;
    }
  }

  private handleVelocity(delta: number): void {
    if (Keyboard.isPressed('ArrowUp') && this.velocityY != this.maxVelocityY) {
      this.velocityY += this.accelerationRateY * delta;
      if (this.velocityY > this.maxVelocityY) this.velocityY = this.maxVelocityY;
      return;
    }

    if (Keyboard.isPressed('ArrowDown') && this.velocityY != this.minVelocityY) {
      this.velocityY -= this.accelerationRateY * delta;
      if (this.velocityY < this.minVelocityY) this.velocityY = this.minVelocityY;
      return;
    }

    if (!Keyboard.isPressed('ArrowDown') && !Keyboard.isPressed('ArrowUp')) {
      this.approachToBaseVelocity(delta);
    }
  }

  private handleShooting(): void {
    if (Keyboard.isPressed(' ') && this.secondsFromPreviousBullet >= 1 / this.bulletsPerSecond) {
      this.fireBullet();
      this.secondsFromPreviousBullet = 0;
    }
  }

  private fireBullet(): void {
    const bullet = new PlayerBullet(this.bulletWidth, this.bulletHeight);
    this.bullets.push(bullet);
    bullet.position.set(this.position.x - this.bulletWidth / 2, this.position.y - this.bulletHeight);
  }

  private updateBullets(delta: number): void {
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];

      bullet.duration += delta / 1000;
      if (bullet.duration > bullet.maxDuration) {
        this.bullets.splice(i, 1);
        continue;
      }
      bullet.position.set(this.position.x - this.bulletWidth / 2, bullet.position.y - bullet.velocity * delta);
    }
    this.secondsFromPreviousBullet += delta / 1000;
  }

  private updatePosition(delta: number): void {
    const pos = this.position.copy();
    if (this.directionX == DirectionX.None)
      this.setPosition(pos.add(0, -this.velocityY * delta));
    else if (this.directionX == DirectionX.Left)
      this.setPosition(pos.add(-this.velocityX * delta, -this.velocityY * delta));
    else if (this.directionX == DirectionX.Right)
      this.setPosition(pos.add(this.velocityX * delta, -this.velocityY * delta));
  }

  private approachToBaseVelocity(delta: number): void {
    if (this.velocityY == this.baseVelocityY) {
      return;
    }
    else if (Math.abs(this.baseVelocityY - this.velocityY) <= this.accelerationRateY * delta) {
      this.velocityY = this.baseVelocityY;
    }
    else if (this.baseVelocityY < this.velocityY) {
      this.velocityY -= this.accelerationRateY * delta;
    }
    else if (this.baseVelocityY > this.velocityY) {
      this.velocityY += this.accelerationRateY * delta;
    }
  }
}