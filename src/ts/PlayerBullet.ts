import Bullet from "./objects/image-objects/player/Bullet";

export default class PlayerBullet extends Bullet {
  public duration: number = 0;
  public maxDuration: number = 0.7;
  public velocity: number = 2.5;

  public constructor(width: number, height: number) {
    super(width, height);
  }
}