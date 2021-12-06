import CanvasObject from "./CanvasObject";
import { CanvasType } from "./types/CanvasType";
import Vector2 from "./Vector2";

function* id(): Generator<number, number, number> {
  let id = 0;

  while(true) {
    yield id++;
  }
}

const idGenerator = id();

export default class CanvasGroup {
  private id: number = idGenerator.next().value;
  public realPosition: Vector2 = new Vector2(0, 0);
  public type: CanvasType = CanvasType.Group;
  public position: Vector2 = new Vector2(0, 0);
  public objects: CanvasObject[] = [];
  public groups: CanvasGroup[] = [];

  public constructor(...objects: CanvasObject[]) {
    this.objects = objects;
  }
}