import Assets from "../../../core/Assets";
import ImageObject from "../../ImageObject";

export default class BigMountains extends ImageObject {
  public constructor(width: number, height: number) {
    super(Assets.images.atari8, 69, 114, 36, 11, width, height);
  }
}