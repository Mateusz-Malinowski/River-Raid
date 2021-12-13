import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Chopper1Left extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 37, 57, 16, 10, width, height);
  }
}