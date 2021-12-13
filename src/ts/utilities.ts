import CanvasObject from "./core/CanvasObject";
import Vector2 from "./core/Vector2";
import Player from "./Player";

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

export function removeElementFromArray<T>(array: Array<T>, element: T): void {
  const index = array.indexOf(element);
  array.splice(index, 1);
}

export function objectsPositionColliding(object1: CanvasObject, object2: CanvasObject): boolean {
  if (
    object1.position.x < object2.position.x + object2.width &&
    object1.position.x + object1.width > object2.position.x &&
    object1.position.y < object2.position.y + object2.height &&
    object1.height + object1.position.y > object2.position.y
  )
    return true;

  return false;
}

export function objectsYAxisColliding(object1: CanvasObject, object2: CanvasObject): boolean {
  if (
    object1.position.y < object2.position.y + object2.height &&
    object1.height + object1.position.y > object2.position.y
  )
    return true;
    
  return false;
}

export function objectsRealPositionColliding(object1: CanvasObject, object2: CanvasObject): boolean {
  if (
    object1.realPosition.x < object2.realPosition.x + object2.width &&
    object1.realPosition.x + object1.width > object2.realPosition.x &&
    object1.realPosition.y < object2.realPosition.y + object2.height &&
    object1.height + object1.realPosition.y > object2.realPosition.y
  )
    return true;

  return false;
}

export function objectsRealPositionYDifference(object1: CanvasObject, object2: CanvasObject): number {
  return Math.abs(object1.realPosition.y - object2.realPosition.y);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}