import Canvas from "./Canvas";
import CanvasGroup from "./CanvasGroup";
import CanvasObject from "./CanvasObject";
import { CanvasElement } from "./types/CanvasElement";
import { CanvasType } from "./types/CanvasType";
import Vector2 from "./Vector2";

export default class Scene {
  private elements: CanvasElement[] = [];

  public add(object: CanvasObject | CanvasGroup): void {
    this.elements.push(object);
  }

  public remove(object: CanvasObject | CanvasGroup): void {
    const index = this.elements.indexOf(object);
    this.elements.splice(index, 1);
  }

  public draw(): void {
    Canvas.clear();

    for (const element of this.elements) {
      if (element.type == CanvasType.Object) {
        const object = element as CanvasObject;
        object.realPosition.copy(object.position);
        this.drawObject(object);
        continue;
      }

      const group = element as CanvasGroup;
      group.realPosition.copy(group.position);
      this.drawGroup(group);
    }
  }

  private drawGroup(group: CanvasGroup): void {
    this.alignPositions(group);

    for (const object of group.objects)
      this.drawObject(object);

    for (const innerGroup of group.groups)
      this.drawGroup(innerGroup);
  }

  private drawObject(object: CanvasObject): void {
    Canvas.reset();
    object.draw();
  }

  private alignPositions(group: CanvasGroup): void {
    for (const object of group.objects)
      object.realPosition.set(group.realPosition.x + object.position.x, group.realPosition.y + object.position.y);
    for (const innerGroup of group.groups) {
      innerGroup.realPosition.set(group.realPosition.x + innerGroup.position.x, group.realPosition.y + innerGroup.position.y);
    }
  }
}