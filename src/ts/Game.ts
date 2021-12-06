import Canvas from "./core/Canvas";
import Scene from "./core/Scene";
import Vector2 from "./core/Vector2";
import GameInfo from "./groups/GameInfo";
import Rectangle from "./objects/Rectangle";

export default class Game {
  private scene: Scene;
  private gameInfoHeight: number = 250;
  private gameInfo: GameInfo;

  private score: number = 0;
  private numberOfLives: number = 3;

  public constructor(scene: Scene) {
    this.scene = scene;
    this.init();
  }

  private init(): void {
    this.addBackground();
    this.addGameInfo();
  }

  private addBackground(): void {
    const background = new Rectangle(Canvas.width, Canvas.height, '#666');
    this.scene.add(background);
  }

  private addGameInfo(): void {
    this.gameInfo = new GameInfo(this.gameInfoHeight);
    this.gameInfo.position.set(0, Canvas.height - this.gameInfoHeight);
    this.gameInfo.setScore(this.score);
    this.gameInfo.setNumberOfLives(this.numberOfLives);
    this.gameInfo.fuelIndicator.setHand(1);
    this.scene.add(this.gameInfo);
  }

  public render = (delta: number): void => {

  }
}