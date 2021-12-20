import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class TankObject extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.atari8, 131, 115, 16, 9, width, height);
  }
}