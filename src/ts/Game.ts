import Assets from "./core/Assets";
import Canvas from "./core/Canvas";
import Scene from "./core/Scene";
import Vector2 from "./core/Vector2";
import GameInfo from "./groups/GameInfo";
import ImageObject from "./objects/ImageObject";
import Plane from "./objects/Plane";
import Rectangle from "./objects/Rectangle";
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
    const plane = new Plane(80, 80);
    this.cameraOffset -= 80;
    this.player = new Player(0.05, plane);
    this.scene.add(this.player.object);
  }

  public render = (delta: number): void => {
    const playerPosition = this.player.getPosition();
    playerPosition.add(this.player.velocity * delta, this.player.velocity * delta);

    this.player.setPosition(playerPosition);

    // follow the player on y axis
    this.scene.camera.position.set(0, this.player.getPosition().y - this.cameraOffset);
  }
}