import Assets from "../../../core/Assets";
import Explosion from "./Explosion";

export default class GreenBigExplosion extends Explosion {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 30, 99, 26, 8, width, height);
  }
}