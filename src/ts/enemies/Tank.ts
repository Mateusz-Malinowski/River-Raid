import Level from "../Level";
import TankObject from "../objects/image-objects/enemies/TankObject";
import { EnemyType } from "./EnemyType";

export default class Tank extends TankObject {
  public enemyType: EnemyType = EnemyType.Tank;
  public pointsForDestruction: number = 150;
  public thresholdY: number = 1000;

  public isMoving: boolean = false;
  public velocityX: number = 0;

  public constructor(width: number, height: number) {
    super(width, height);
  }

  public render(level: Level, delta: number): void {
    this.updatePosition(level, delta);
  }

  private updatePosition(level: Level, delta: number): void {
    this.position.x += this.velocityX * delta;
  }

  public startMoving(): void {
    this.velocityX = -0.2;

    this.isMoving = true;
  }

  public stopMoving(): void {
    this.velocityX = 0;
    this.isMoving = false;
  }
}