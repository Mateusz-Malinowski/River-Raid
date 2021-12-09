import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Grass extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 84, 15, 32, 24, width, height);
  }
}