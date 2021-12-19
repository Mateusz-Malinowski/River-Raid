import Level from "../Level";
import Chopper1Right from "../objects/image-objects/enemies/Chopper1Right";
import { getRandomInt, objectsRealPositionColliding } from "../utilities";
import { EnemyType } from "./EnemyType";

export default class Chopper extends Chopper1Right {
  public enemyType: EnemyType = EnemyType.Chopper;
  public pointsForDestruction: number = 60;

  public isMoving: boolean = false;
  public velocityX: number = 0;
  private changeSpriteDelay: number = 20;
  private currentSpriteDuration: number = 0;

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
    this.updateSprite(delta);
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

  private updateSprite(delta: number): void {
    this.currentSpriteDuration += delta;

    if (this.currentSpriteDuration >= this.changeSpriteDelay)
      this.changeSprite();
  }

  private changeSprite(): void {
    if (this.spriteX == 37) // chopper1Left
      this.spriteX = 53;
    else if (this.spriteX == 53) // chopper2left
      this.spriteX = 37;
    else if (this.spriteX == 3) // chopper1right
      this.spriteX = 21;
    else if (this.spriteX == 21) // chopper2right
      this.spriteX = 3;

    this.currentSpriteDuration = 0;
  }

  private flipSprite(): void {
    if (this.spriteX == 37) { // chopper1Left 
      this.spriteX = 3;
      this.spriteY = 46;
    }
    else if (this.spriteX == 53) { // chopper2left
      this.spriteX = 21;
      this.spriteY = 46;
    }
    else if (this.spriteX == 3) { // chopper1right
      this.spriteX = 37;
      this.spriteY = 57;
    } 
    else if (this.spriteX == 21) { // chopper2right
      this.spriteX = 53;
      this.spriteY = 57;
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