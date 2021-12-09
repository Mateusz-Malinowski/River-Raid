import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class HouseAndTree extends ImageObject {
  public constructor(width: number, height: number, inverted: boolean = false) {
    if (inverted)
      super(Assets.images.sprite, 180, 54, 32, 19, width, height);
    else
      super(Assets.images.sprite, 117, 15, 32, 19, width, height);
  }
}