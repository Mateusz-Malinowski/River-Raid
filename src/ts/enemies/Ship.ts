import Level from "../Level";
import ShipObjectRight from "../objects/image-objects/enemies/ShipObjectRight";
import { getRandomInt, objectsRealPositionColliding } from "../utilities";
import { EnemyType } from "./EnemyType";

export default class Ship extends ShipObjectRight {
  public enemyType: EnemyType = EnemyType.Ship;
  public pointsForDestruction: number = 30;

  public isMoving: boolean = false;
  public velocityX: number = 0;
  
  private directionRight: boolean;

  public constructor(width: number, height: number) {
    super(width, height);

    this.directionRight = getRandomInt(0, 2) == 0 ? false : true;
    if (!this.directionRight) {
      this.flipSprite();
    }
  }

  public render(level: Level, delta: number): void {
    this.updatePosition(level, delta);
  }

  private flipSprite(): void {
    if (this.spriteY == 58)
      this.spriteY = 66;
    else
      this.spriteY = 58;
  }

  private updatePosition(level: Level, delta: number): void {
    this.position.x += this.velocityX * delta;
    for (const object of level.staticObjects) {
      if (objectsRealPositionColliding(object, this)) {
        this.velocityX *= -1;
        this.position.x += this.velocityX * delta * 2;
        this.flipSprite();
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