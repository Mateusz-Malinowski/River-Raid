import Assets from "../../../core/Assets";
import Enemy from "./Enemy";

export default class Ship extends Enemy {
  public constructor(width: number, height: number) {
    super(Assets.images.sprite, 4, 58, 32, 8, width, height);
  }
}