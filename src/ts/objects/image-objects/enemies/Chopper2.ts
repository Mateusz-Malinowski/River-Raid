import Assets from "../../../core/Assets";
import Enemy from "./Enemy";

export default class Chopper2 extends Enemy {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 21, 46, 16, 10, width, height);
  }
}