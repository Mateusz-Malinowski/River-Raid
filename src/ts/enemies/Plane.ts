import Level from "../Level";
import PlaneObject from "../objects/image-objects/enemies/PlaneObject";
import { EnemyType } from "./EnemyType";

export default class Plane extends PlaneObject {
  public enemyType: EnemyType = EnemyType.Plane;
  public pointsForDestruction: number = 100;
  public thresholdY: number = 500;

  public isMoving: boolean = false;
  public velocityX: number = 0;
  
  public constructor(width: number, height: number) {
    super(width, height);
    this.zIndex = 10;
  }

  public render(level: Level, delta: number): void {
    this.updatePosition(level, delta);
  }

  private updatePosition(level: Level, delta: number): void {
    this.position.x += this.velocityX * delta;
  }

  public startMoving(): void {
    this.velocityX = -1;
    this.isMoving = true;
  }

  public stopMoving(): void {
    this.velocityX = 0;
    this.isMoving = false;
  }
}