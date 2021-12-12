import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class Bridge extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 172, 16, 63, 22, width, height);
  }
}