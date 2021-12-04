import Vector2 from "./Vector2";

function* id(): Generator<number, number, number> {
  let id = 0;

  while(true) {
    yield id++;
  }
}

const idGenerator = id();

export default abstract class CanvasObject {
  private id: number = idGenerator.next().value;
  public position: Vector2 = new Vector2(0, 0);
  public abstract draw(): void;
}