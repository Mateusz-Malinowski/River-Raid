import Bridge from "./objects/image-objects/map/Bridge";

export default class LevelBridge extends Bridge {
  public pointsForDestruction: number = 500;

  public constructor(width: number, height: number) {
    super(width, height);
  }
}