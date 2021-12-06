import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class PlaneLeft extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 13, 18, 10, 14, width, height);
  }
}