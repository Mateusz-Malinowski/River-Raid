import Canvas from "./Canvas";
import CanvasObject from "./CanvasObject";

export default class Scene {
  private objects: CanvasObject[] = [];

  public add(object: CanvasObject): void {
    this.objects.push(object);
  }

  public remove(object: CanvasObject): void {
    const index = this.objects.indexOf(object);
    this.objects.splice(index, 1);
  }

  public draw(): void {
    Canvas.clear();

    for (const object of this.objects)
      object.draw();
  }
}