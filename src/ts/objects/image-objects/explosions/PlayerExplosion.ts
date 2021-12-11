import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class PlayerExplosion extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 8, 78, 14, 11, width, height);
  }
}