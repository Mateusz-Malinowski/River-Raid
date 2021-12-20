import Level from "../Level";
import BalloonObject from "../objects/image-objects/enemies/BalloonObject";
import TankObject from "../objects/image-objects/enemies/TankObject";
import { getRandomInt, objectsRealPositionColliding } from "../utilities";
import { EnemyType } from "./EnemyType";

export default class Balloon extends BalloonObject {
  public enemyType: EnemyType = EnemyType.Balloon;
  public pointsForDestruction: number = 60;
  public thresholdY: number = 300;

  public isMoving: boolean = false;
  public velocityX: number = 0;

  private directionRight: boolean;

  public constructor(width: number, height: number) {
    super(width, height);

    this.directionRight = getRandomInt(0, 2) == 0 ? false : true;
  }

  public render(level: Level, delta: number): void {
    this.updatePosition(level, delta);
  }

  private updatePosition(level: Level, delta: number): void {
    this.position.x += this.velocityX * delta;
    for (const object of level.staticObjects) {
      if (objectsRealPositionColliding(object, this)) {
        this.velocityX *= -1;
        this.position.x += this.velocityX * delta * 2;
        break;
      }
    }
  }

  public startMoving(): void {
    if (this.directionRight)
      this.velocityX = 0.2;
    else
      this.velocityX = -0.2;

    this.isMoving = true;
  }

  public stopMoving(): void {
    this.velocityX = 0;
    this.isMoving = false;
  }
}