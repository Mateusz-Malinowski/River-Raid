export default class Keyboard {
  private static pressedKeys: string[] = [];

  public static create(): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  public static destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  public static isPressed(key: string): boolean {
    return this.pressedKeys.includes(key);
  }

  public static getPressedKeys(): string[] {
    return this.pressedKeys;
  }

  private static onKeyDown = (event: KeyboardEvent): void => {
    if (!Keyboard.pressedKeys.includes(event.key))
      Keyboard.pressedKeys.push(event.key);
  }

  private static onKeyUp = (event: KeyboardEvent): void => {
    const index = Keyboard.pressedKeys.indexOf(event.key);
    Keyboard.pressedKeys.splice(index, 1);
  }
}