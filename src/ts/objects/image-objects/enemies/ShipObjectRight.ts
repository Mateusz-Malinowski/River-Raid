import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class ShipObjectRight extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 4, 66, 32, 8, width, height);
  }
}