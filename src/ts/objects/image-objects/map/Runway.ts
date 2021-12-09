import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Runway extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 67, 14, 16, 26, width, height);
  }
}