import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Chopper2Left extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 53, 57, 16, 10, width, height);
  }
}