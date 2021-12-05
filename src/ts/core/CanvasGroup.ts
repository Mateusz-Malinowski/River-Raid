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
  public type: CanvasType = CanvasType.Group;
  private position: Vector2 = new Vector2(0, 0);
  public objects: CanvasObject[] = [];
  public groups: CanvasGroup[] = [];

  public constructor(...objects: CanvasObject[]) {
    this.objects = objects;
  }

  public setPosition(x: number, y: number): void {
    this.position.set(x, y);

    for (const object of this.objects)
      object.position.set(this.position.x + object.position.x, this.position.y + object.position.y);
    for (const group of this.groups) {
      group.setPosition(this.position.x, this.position.y);
    }
  }
}