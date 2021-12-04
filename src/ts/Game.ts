import Scene from "./core/Scene";
import Vector2 from "./core/Vector2";
import Rectangle from "./objects/Rectangle";

export default class Game {
  private scene: Scene;

  public constructor(scene: Scene) {
    this.scene = scene;
    this.init();
  }

  private init(): void {
    const rectangle1 = new Rectangle(100, 100);
    const rectangle2 = new Rectangle(200, 200);
    this.scene.add(rectangle1);
    this.scene.add(rectangle2);
  }

  public render = (delta: number): void => {
    
  }
}