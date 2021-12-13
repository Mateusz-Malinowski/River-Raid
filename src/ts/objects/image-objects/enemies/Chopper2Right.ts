import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Chopper2Right extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 21, 46, 16, 10, width, height);
  }
}