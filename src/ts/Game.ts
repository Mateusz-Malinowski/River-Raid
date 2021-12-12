import Canvas from "./core/Canvas";
import CanvasGroup from "./core/CanvasGroup";
import Scene from "./core/Scene";
import Vector2 from "./core/Vector2";
import GameInfo from "./groups/GameInfo";
import MapGenerator from "./MapGenerator";
import Line from "./objects/basic/Line";
import Rectangle from "./objects/basic/Rectangle";
import PlayerExplosion from "./objects/image-objects/explosions/PlayerExplosion";
import Bridge from "./objects/image-objects/map/Bridge";
import Runway from "./objects/image-objects/map/Runway";
import Player from "./Player";
import { objectsRealPositionColliding } from "./utilities";

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
  private runwayMargin: number = 15;

  private currentLevel: CanvasGroup;
  private nextLevelBridge: Bridge;
  private nextLevel: CanvasGroup;

  private score: number = 80;
  private numberOfLives: number = 3;

  public constructor(scene: Scene) {
    this.scene = scene;
    this.init();
  }

  private init(): void {
    this.addBackground();
    this.addMap();
    this.addPlayer();
    this.addGameInfo();
  }

  public beforeDrawing = (delta: number): void => {
    if (!this.player.isDead) {
      this.updatePlayerAndBullets(delta);
    }

    this.moveCameraToPlayer();
  }

  public afterDrawing = (delta: number): void => {
    if (!this.player.isDead && !this.player.isStopped) {
      this.handleCollisions();
    }
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
    this.movePlayerToLevelStart();
    this.scene.add(this.player.object);
  }

  private addMap(): void {
    const level = MapGenerator.generateLevel();
    const bridge = level[1]
    this.currentLevel = level[0];

    // remove bridge from first level
    const index = this.currentLevel.objects.indexOf(bridge);
    this.currentLevel.objects.splice(index, 1);
    this.scene.add(this.currentLevel);
    this.addNextLevel();
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
      if (objectsRealPositionColliding(object, this.player.object)) {
        const playerExplosion = new PlayerExplosion(this.playerExplosionWidth, this.playerExplosionHeight);
        playerExplosion.position.set(
          this.player.getPosition().x - this.playerExplosionWidth / 2,
          this.player.getPosition().y - this.playerExplosionHeight / 2
        )
        this.scene.add(playerExplosion);

        this.destroyPlayer();
        if (this.numberOfLives == 0) {
          // game over
        }
        else {
          this.numberOfLives--;
          this.gameInfo.setNumberOfLives(this.numberOfLives);
          setTimeout(() => {
            this.scene.remove(playerExplosion);
            this.revivePlayer();
          }, this.reviveTimeMs);
        }

        break;
      }
    }

    if (objectsRealPositionColliding(this.nextLevelBridge, this.player.object)) {
      this.progressLevel();
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
    this.movePlayerToLevelStart();
  }

  private progressLevel(): void {
    this.scene.remove(this.currentLevel);
    this.currentLevel = this.nextLevel;
    this.addNextLevel();
  }

  private addNextLevel(): void {
    const level = MapGenerator.generateLevel();
    this.nextLevel = level[0];
    this.nextLevelBridge = level[1];
    this.nextLevel.position.set(0, this.currentLevel.position.y - MapGenerator.levelHeight);
    this.scene.add(this.nextLevel);
  }

  private movePlayerToLevelStart(): void {
    const pos = new Vector2(Canvas.width / 2, this.currentLevel.position.y - MapGenerator.sectionHeight / 2 + this.runwayMargin);
    this.player.setPosition(pos);
  }
}