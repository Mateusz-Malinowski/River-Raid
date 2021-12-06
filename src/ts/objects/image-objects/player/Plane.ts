import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Plane extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 26, 17, 14, 14, width, height);
  }
}