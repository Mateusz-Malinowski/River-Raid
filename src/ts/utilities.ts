import CanvasObject from "./core/CanvasObject";
import Vector2 from "./core/Vector2";

/**
 * 
 * @param min minimum value
 * @param max maximum value
 * @returns a number in <min, max)
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function objectsColliding(object1: CanvasObject, object2: CanvasObject): boolean {
  if (
    object1.position.x < object2.position.x + object2.width &&
    object1.position.x + object1.width > object2.position.x &&
    object1.position.y < object2.position.y + object2.height &&
    object1.height + object1.position.y > object2.position.y
  )
    return true;

  return false;
}