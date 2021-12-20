import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class SmallMountains extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.atari8, 105, 114, 24, 7, width, height);
  }
}