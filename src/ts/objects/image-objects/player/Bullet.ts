import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Bullet extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 6, 21, 2, 8, width, height);
  }
}