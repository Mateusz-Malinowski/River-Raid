import Canvas from "./Canvas";
import CanvasGroup from "./CanvasGroup";
import CanvasObject from "./CanvasObject";
import { CanvasElement } from "./types/CanvasElement";
import { CanvasType } from "./types/CanvasType";

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
        this.drawObject(object);
        continue;
      }
      
      const group = element as CanvasGroup;
      this.drawGroup(group);
    }
  }

  private drawGroup(group: CanvasGroup): void {
    for (const object of group.objects)
      this.drawObject(object);

    for (const innerGroup of group.groups)
      this.drawGroup(innerGroup);
  }

  private drawObject(object: CanvasObject): void {
    Canvas.reset();
    object.draw();
  }
}