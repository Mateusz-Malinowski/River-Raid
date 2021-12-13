import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class PlaneObject extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 40, 49, 16, 6, width, height);
  }
}