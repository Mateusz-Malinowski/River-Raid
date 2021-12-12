import Assets from "../../../core/Assets";
import Explosion from "./Explosion";

export default class ColorfullBigExplosion extends Explosion {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 26, 111, 34, 12, width, height);
  }
}