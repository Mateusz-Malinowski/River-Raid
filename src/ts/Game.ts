import Canvas from "./core/Canvas";
import CanvasGroup from "./core/CanvasGroup";
import Scene from "./core/Scene";
import Vector2 from "./core/Vector2";
import GameInfo from "./groups/GameInfo";
import MapGenerator from "./MapGenerator";
import Line from "./objects/basic/Line";
import Rectangle from "./objects/basic/Rectangle";
import PlayerExplosion from "./objects/image-objects/explosions/PlayerExplosion";
import Runway from "./objects/image-objects/map/Runway";
import Player from "./Player";
import { objectsColliding } from "./utilities";

export default class Game {
  private scene: Scene;
  private player: Player;

  private gameInfo: GameInfo;
  private gameInfoHeight: number = 250;
  private playerDistance: number = 100;
  private cameraOffset: number = this.gameInfoHeight - Canvas.height + this.playerDistance;
  private playerExplosionWidth: number = 112;
  private playerExplosionHeight: number = 88;
  private reviveTimeMs: number = 2500;

  private currentLevel: CanvasGroup;
  private nextLevel: CanvasGroup;

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
    this.currentLevel = MapGenerator.generateLevel();
    this.nextLevel = MapGenerator.generateLevel();
    this.scene.add(this.currentLevel);
  }

  public render = (delta: number): void => {
    if (!this.player.isDead) {
      this.updatePlayerAndBullets(delta);
      this.handleCollisions();
    }

    this.moveCameraToPlayer();
  }

  private updatePlayerAndBullets(delta: number): void {
    for (const bullet of this.player.bullets) {
      this.scene.remove(bullet);
    }
    this.scene.remove(this.player.object);
    this.player.render(delta);
    this.scene.add(this.player.object);
    for (const bullet of this.player.bullets) {
      this.scene.add(bullet);
    }
  }

  private handleCollisions(): void {
    this.handlePlayerCollision();
  }

  private handlePlayerCollision(): void {
    for (const object of this.currentLevel.objects) {
      if (objectsColliding(object, this.player.object)) {
        const playerExplosion = new PlayerExplosion(this.playerExplosionWidth, this.playerExplosionHeight);
        playerExplosion.position.set(
          this.player.getPosition().x - this.playerExplosionWidth / 2,
          this.player.getPosition().y - this.playerExplosionHeight / 2
        )
        this.scene.add(playerExplosion);
        this.destroyPlayer();
        setTimeout(() => {
          this.scene.remove(playerExplosion);
          this.revivePlayer();
        }, this.reviveTimeMs);
        break;
      }
    }
  }

  private moveCameraToPlayer(): void {
    this.scene.camera.position.set(0, this.player.getPosition().y + this.cameraOffset);
  }

  private destroyPlayer(): void {
    this.scene.remove(this.player.object);
    for (const bullet of this.player.bullets) {
      this.scene.remove(bullet);
    }

    this.player.isDead = true;
  }

  private revivePlayer(): void {
    this.player = new Player();
    this.player.setPosition(new Vector2(Canvas.width / 2, this.currentLevel.position.y - this.playerDistance));
  }
}