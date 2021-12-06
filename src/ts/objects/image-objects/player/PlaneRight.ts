import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class PlaneRight extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 43, 18, 10, 14, width, height);
  }
}