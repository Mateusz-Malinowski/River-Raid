import Assets from "../../../core/Assets";
import Explosion from "./Explosion";

export default class GreenSmallExplosion extends Explosion {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 7, 99, 12, 8, width, height);
  }
}