import Assets from "../../../core/Assets";
import Explosion from "./Explosion";

export default class YellowExplosion extends Explosion {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 8, 78, 14, 11, width, height);
  }
}