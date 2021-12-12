import Assets from "../../../core/Assets";
import Explosion from "./Explosion";

export default class ColorfulSmallExplosion extends Explosion {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 5, 111, 16, 12, width, height);
  }
}