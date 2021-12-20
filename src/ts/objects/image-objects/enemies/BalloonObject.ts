import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class BalloonObject extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.atari8, 152, 114, 16, 21, width, height);
  }
}