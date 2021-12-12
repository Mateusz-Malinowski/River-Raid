import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Ship extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 4, 58, 32, 8, width, height);
  }
}