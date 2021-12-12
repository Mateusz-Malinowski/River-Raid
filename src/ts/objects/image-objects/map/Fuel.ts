import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Fuel extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 153, 15, 14, 24, width, height);
  }
}