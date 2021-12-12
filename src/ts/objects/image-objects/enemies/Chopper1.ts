import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Chopper1 extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 3, 46, 16, 10, width, height);
  }
}