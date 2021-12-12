import Assets from "../../../core/Assets";
import Enemy from "./Enemy";

export default class Plane extends Enemy {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 40, 49, 16, 6, width, height);
  }
}