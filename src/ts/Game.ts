import Assets from "./core/Assets";
import Canvas from "./core/Canvas";
import Keyboard from "./core/Keyboard";
import Scene from "./core/Scene";
import Vector2 from "./core/Vector2";
import GameInfo from "./groups/GameInfo";
import ImageObject from "./objects/ImageObject";
import Rectangle from "./objects/basic/Rectangle";
import Player from "./Player";

export default class Game {
  private scene: Scene;
  private player: Player;

  private gameInfo: GameInfo;
  private gameInfoHeight: number = 250;
  private cameraOffset: number = Canvas.height - this.gameInfoHeight;

  private score: number = 0;
  private numberOfLives: number = 3;

  public constructor(scene: Scene) {
    this.scene = scene;
    this.init();
  }

  private init(): void {
    this.addBackground();
    this.addGameInfo();
    this.addPlayer();
  }

  private addBackground(): void {
    const background = new Rectangle(Canvas.width, Canvas.height, '#900');
    background.isFixed = true;
    this.scene.add(background);
  }

  private addGameInfo(): void {
    this.gameInfo = new GameInfo(this.gameInfoHeight);
    this.gameInfo.isFixed = true;
    this.gameInfo.position.set(0, Canvas.height - this.gameInfoHeight);
    this.gameInfo.setScore(this.score);
    this.gameInfo.setNumberOfLives(this.numberOfLives);
    this.gameInfo.fuelIndicator.setHand(1);
    this.scene.add(this.gameInfo);
  }

  private addPlayer(): void {
    this.cameraOffset -= 120;
    this.player = new Player(0.1, 2, 1, 1, 0.05);
    this.scene.add(this.player.object);
  }

  public render = (delta: number): void => {
    this.scene.remove(this.player.object);
    this.player.render(delta);
    this.scene.add(this.player.object);

    // follow the player on y axis
    this.scene.camera.position.set(0, this.player.getPosition().y - this.cameraOffset);
  }
}