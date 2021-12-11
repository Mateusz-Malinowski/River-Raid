import Canvas from "./core/Canvas";
import Scene from "./core/Scene";
import Vector2 from "./core/Vector2";
import GameInfo from "./groups/GameInfo";
import MapGenerator from "./MapGenerator";
import Line from "./objects/basic/Line";
import Rectangle from "./objects/basic/Rectangle";
import Runway from "./objects/image-objects/map/Runway";
import Player from "./Player";

export default class Game {
  private scene: Scene;
  private player: Player;

  private gameInfo: GameInfo;
  private gameInfoHeight: number = 250;
  private playerDistance: number = 100;
  private cameraOffset: number = this.gameInfoHeight - Canvas.height + this.playerDistance;

  private score: number = 80;
  private numberOfLives: number = 3;

  public constructor(scene: Scene) {
    this.scene = scene;
    this.init();
  }

  private init(): void {
    this.addBackground();
    this.addPlayer();
    this.addMap();
    this.addGameInfo();
  }

  private addBackground(): void {
    const background = new Rectangle(Canvas.width, Canvas.height, '#2d32b8');
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
    this.player = new Player();
    this.player.setPosition(new Vector2(Canvas.width / 2, -this.playerDistance));
    this.scene.add(this.player.object);
  }

  private addMap(): void {
    const map = MapGenerator.generate();
    this.scene.add(map);
  }

  public render = (delta: number): void => {
    for (const bullet of this.player.bullets) {
      this.scene.remove(bullet);
    }
    this.scene.remove(this.player.object);
    this.player.render(delta);
    this.scene.add(this.player.object);
    for (const bullet of this.player.bullets) {
      this.scene.add(bullet);
    }

    // follow the player on y axis
    this.scene.camera.position.set(0, this.player.getPosition().y + this.cameraOffset);
  }
}