import Canvas from "./core/Canvas";
import Scene from "./core/Scene";
import Vector2 from "./core/Vector2";
import GameInfo from "./groups/GameInfo";
import Level from "./Level";
import LevelGenerator from "./LevelGenerator";
import Rectangle from "./objects/basic/Rectangle";
import ColorfullBigExplosion from "./objects/image-objects/explosions/ColorfulBigExplosion";
import ColorfulSmallExplosion from "./objects/image-objects/explosions/ColorfulSmallExplosion";
import Explosion from "./objects/image-objects/explosions/Explosion";
import GreenBigExplosion from "./objects/image-objects/explosions/GreenBigExplosion";
import GreenSmallExplosion from "./objects/image-objects/explosions/GreenSmallExplosion";
import YellowExplosion from "./objects/image-objects/explosions/YellowExplosion";
import LevelFuel from "./LevelFuel";
import Player from "./Player";
import PlayerBullet from "./PlayerBullet";
import { delay, objectsRealPositionColliding, objectsRealPositionYDifference, removeElementFromArray } from "./utilities";
import { EnemyType } from "./enemies/EnemyType";
import CanvasObject from "./core/CanvasObject";
import { Enemy } from "./enemies/Enemy";

export default class Game {
  private scene: Scene;
  private player: Player;
  private background: Rectangle;
  private gameInfo: GameInfo;

  private riverColorNormal: string = '#0243db';
  private riverColorAnomaly: string = '#803228';
  private gameInfoHeight: number = 250;
  private playerDistance: number = 100;
  private cameraOffset: number = this.gameInfoHeight - Canvas.height + this.playerDistance;
  private playerExplosionWidth: number = 112;
  private playerExplosionHeight: number = 88;
  private playerExplosionDuration: number = 2500;
  private greenSmallExplosionWidth: number = 60;
  private greenSmallExplosionHeight: number = 40;
  private greenBigExplosionWidth: number = 130;
  private greenBigExplosionHeight: number = 40;
  private colorfulSmallExplosionWidth: number = 80;
  private colorfulSmallExplosionHeight: number = 60;
  private colorfulBigExplosionWidth: number = 170;
  private colorfulBigExplosionHeight: number = 60;
  private objectExplosionDuration: number = 600;
  private runwayMargin: number = 15;

  private previousLevel: Level = new Level();
  private currentLevelAtStart: Level = new Level();
  private currentLevel: Level;
  private nextLevel: Level;

  private fuelConsumptionRate: number = 0.00003;
  private refuelRate: number = 0.0005;

  private score: number = 0;
  private numberOfLives: number = 3;
  private fuel: number = 1;

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
      if (!this.player.isStopped) {
        this.updateFuel(delta);
      }
    }

    this.moveCameraToPlayer();
  }

  public afterDrawing = (delta: number): void => {
    if (!this.player.isDead && !this.player.isStopped) {
      this.handleCollisions(delta);
    }

    this.updateEnemies(delta);
  }

  private addBackground(): void {
    this.background = new Rectangle(Canvas.width, Canvas.height, this.riverColorNormal);
    this.background.isFixed = true;
    this.scene.add(this.background);
  }

  private addGameInfo(): void {
    this.gameInfo = new GameInfo(this.gameInfoHeight);
    this.gameInfo.isFixed = true;
    this.gameInfo.zIndex = 1;
    this.gameInfo.position.set(0, Canvas.height - this.gameInfoHeight);
    this.gameInfo.setScore(this.score);
    this.gameInfo.setNumberOfLives(this.numberOfLives);
    this.gameInfo.fuelIndicator.setHand(this.fuel);
    this.scene.add(this.gameInfo);
  }

  private addPlayer(): void {
    this.player = new Player();
    this.movePlayerToLevelStart();
    this.scene.add(this.player.object);
  }

  private addMap(): void {
    this.currentLevel = LevelGenerator.generate();
    // remove bridge from first level
    removeElementFromArray(this.currentLevel.objects, this.currentLevel.bridge);

    this.currentLevelAtStart.copy(this.currentLevel);

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

  private updateEnemies(delta: number): void {
    for (const enemy of this.currentLevel.enemyObjects) {
      if (!enemy.isMoving && objectsRealPositionYDifference(this.player.object, enemy) <= enemy.thresholdY) {
        enemy.startMoving();
      }
      enemy.render(this.currentLevel, delta);
    }
    for (const enemy of this.previousLevel.enemyObjects) {
      if (!enemy.isMoving && objectsRealPositionYDifference(this.player.object, enemy) <= enemy.thresholdY)
        enemy.startMoving();
      enemy.render(this.previousLevel, delta);
    }
  }

  private handleCollisions(delta: number): void {
    this.handlePlayerCollision(delta);
    this.handleBulletsCollision();
  }

  private handlePlayerCollision(delta: number): void {
    for (const object of this.currentLevel.staticObjects) {
      if (objectsRealPositionColliding(object, this.player.object)) {
        this.destroyPlayer();
        break;
      }
    }

    for (const object of this.previousLevel.staticObjects) {
      if (objectsRealPositionColliding(object, this.player.object)) {
        this.destroyPlayer();
        break;
      }
    }

    for (const barrel of this.currentLevel.fuelBarrels) {
      if (objectsRealPositionColliding(barrel, this.player.object)) {
        this.fuel += this.refuelRate * delta;
        if (this.fuel > 1) this.fuel = 1;
        this.gameInfo.fuelIndicator.setHand(this.fuel);
      }
    }

    for (const barrel of this.previousLevel.fuelBarrels) {
      if (objectsRealPositionColliding(barrel, this.player.object)) {
        this.fuel += this.refuelRate * delta;
        if (this.fuel > 1) this.fuel = 1;
        this.gameInfo.fuelIndicator.setHand(this.fuel);
      }
    }

    for (const enemyObject of this.currentLevel.enemyObjects) {
      if (objectsRealPositionColliding(enemyObject, this.player.object)) {
        this.destroyEnemy(this.currentLevel, enemyObject);
        this.destroyPlayer();
        break;
      }
    }

    for (const enemyObject of this.previousLevel.enemyObjects) {
      if (objectsRealPositionColliding(enemyObject, this.player.object)) {
        this.destroyEnemy(this.previousLevel, enemyObject);
        this.destroyPlayer();
        break;
      }
    }

    if (objectsRealPositionColliding(this.nextLevel.bridge, this.player.object)) {
      this.destroyPlayer();
      this.progressLevel();
      this.destroyCurrentBridge();
      this.winkRiver();
    }
  }

  private handleBulletsCollision(): void {
    for (const object of this.currentLevel.staticObjects) {
      for (const bullet of this.player.bullets) {
        if (objectsRealPositionColliding(object, bullet))
          this.destroyBullet(bullet);
      }
    }

    for (const object of this.previousLevel.staticObjects) {
      for (const bullet of this.player.bullets) {
        if (objectsRealPositionColliding(object, bullet))
          this.destroyBullet(bullet);
      }
    }

    for (const fuelBarrel of this.currentLevel.fuelBarrels) {
      for (const bullet of this.player.bullets) {
        if (objectsRealPositionColliding(fuelBarrel, bullet)) {
          this.destroyBullet(bullet);
          this.destroyFuelBarrel(this.currentLevel, fuelBarrel);
        }
      }
    }

    for (const fuelBarrel of this.previousLevel.fuelBarrels) {
      for (const bullet of this.player.bullets) {
        if (objectsRealPositionColliding(fuelBarrel, bullet)) {
          this.destroyBullet(bullet);
          this.destroyFuelBarrel(this.previousLevel, fuelBarrel);
        }
      }
    }

    for (const enemyObject of this.currentLevel.enemyObjects) {
      for (const bullet of this.player.bullets) {
        if (objectsRealPositionColliding(enemyObject, bullet)) {
          this.destroyBullet(bullet);
          this.destroyEnemy(this.currentLevel, enemyObject);
        }
      }
    }

    for (const enemyObject of this.previousLevel.enemyObjects) {
      for (const bullet of this.player.bullets) {
        if (objectsRealPositionColliding(enemyObject, bullet)) {
          this.destroyBullet(bullet);
          this.destroyEnemy(this.previousLevel, enemyObject);
        }
      }
    }

    for (const bullet of this.player.bullets) {
      if (objectsRealPositionColliding(this.nextLevel.bridge, bullet)) {
        this.destroyBullet(bullet);
        this.progressLevel();
        this.destroyCurrentBridge();
        this.winkRiver();
      }
    }
  }

  private moveCameraToPlayer(): void {
    this.scene.camera.position.set(0, this.player.getPosition().y + this.cameraOffset);
  }

  private destroyPlayer(): void {
    const playerExplosion = new YellowExplosion(this.playerExplosionWidth, this.playerExplosionHeight);
    playerExplosion.position.set(
      this.player.getPosition().x - this.playerExplosionWidth / 2,
      this.player.getPosition().y - this.playerExplosionHeight / 2
    )
    this.scene.add(playerExplosion);

    this.scene.remove(this.player.object);
    for (const bullet of this.player.bullets) {
      this.scene.remove(bullet);
    }

    this.player.isDead = true;

    if (this.numberOfLives == 0) { // game over
      setTimeout(() => {
        this.scene.remove(playerExplosion);
        this.score = 0;
        this.gameInfo.setScore(this.score);
      }, this.playerExplosionDuration)
    }
    else {
      setTimeout(() => {
        this.scene.remove(playerExplosion);
        this.revivePlayer();
      }, this.playerExplosionDuration);
    }
  }

  private destroyEnemy(level: Level, enemyObject: Enemy): void {
    removeElementFromArray(level.objects, enemyObject);
    removeElementFromArray(level.enemyObjects, enemyObject);
    this.scene.remove(enemyObject);

    this.score += enemyObject.pointsForDestruction;
    this.gameInfo.setScore(this.score);

    const explosionPosition = new Vector2(
      enemyObject.position.x + enemyObject.width / 2,
      enemyObject.position.y + enemyObject.height / 2
    )

    switch (enemyObject.enemyType) {
      case EnemyType.Ship:
        this.bigExplosionAnimation(level, explosionPosition);
        break;
      default:
        this.smallExplosionAnimation(level, explosionPosition);
    }
  }

  private destroyFuelBarrel(level: Level, barrel: LevelFuel): void {
    removeElementFromArray(level.objects, barrel);
    removeElementFromArray(level.fuelBarrels, barrel);
    this.score += barrel.pointsForDestruction;
    this.gameInfo.setScore(this.score);

    const smallExplosionPosition = new Vector2(
      barrel.position.x + barrel.width / 2,
      barrel.position.y + barrel.height / 2
    );

    this.smallExplosionAnimation(level, smallExplosionPosition);
  }

  private async destroyCurrentBridge(): Promise<void> {
    removeElementFromArray(this.currentLevel.objects, this.currentLevel.bridge);
    removeElementFromArray(this.currentLevelAtStart.objects, this.currentLevel.bridge);
    this.score += this.currentLevel.bridge.pointsForDestruction;
    this.gameInfo.setScore(this.score);

    const smallExplosionPosition1 = new Vector2(
      this.currentLevel.bridge.position.x + this.currentLevel.bridge.width / 4,
      this.currentLevel.bridge.position.y + this.currentLevel.bridge.height / 2
    );

    const smallExplosionPosition2 = new Vector2(
      this.currentLevel.bridge.position.x + (this.currentLevel.bridge.width / 4) * 3,
      this.currentLevel.bridge.position.y + this.currentLevel.bridge.height / 2
    );

    this.currentLevel.bridge = null;

    this.smallExplosionAnimation(this.currentLevel, smallExplosionPosition1);
    this.smallExplosionAnimation(this.currentLevel, smallExplosionPosition2);
  }

  private destroyBullet(bullet: PlayerBullet): void {
    removeElementFromArray(this.player.bullets, bullet);
    this.scene.remove(bullet);
  }

  private smallExplosionAnimation(level: Level, position: Vector2): void {
    const greenSmallExplosion = new GreenSmallExplosion(this.greenSmallExplosionWidth, this.greenSmallExplosionHeight);
    const colorfulSmallExplosion = new ColorfulSmallExplosion(this.colorfulSmallExplosionWidth, this.colorfulSmallExplosionHeight);
    greenSmallExplosion.position.set(position.x - this.greenSmallExplosionWidth / 2, position.y - this.greenSmallExplosionHeight / 2);
    colorfulSmallExplosion.position.set(position.x - this.colorfulSmallExplosionWidth / 2, position.y - this.colorfulSmallExplosionHeight / 2);

    this.playExplosionAnimation(level, greenSmallExplosion, colorfulSmallExplosion);
  }

  private bigExplosionAnimation(level: Level, position: Vector2): void {
    const greenBigExplosion = new GreenBigExplosion(this.greenBigExplosionWidth, this.greenBigExplosionHeight);
    const colorfulBigExplosion = new ColorfullBigExplosion(this.colorfulBigExplosionWidth, this.colorfulBigExplosionHeight);
    greenBigExplosion.position.set(position.x - this.greenBigExplosionWidth / 2, position.y - this.greenBigExplosionHeight / 2);
    colorfulBigExplosion.position.set(position.x - this.colorfulBigExplosionWidth / 2, position.y - this.colorfulBigExplosionHeight / 2);

    this.playExplosionAnimation(level, greenBigExplosion, colorfulBigExplosion);
  }

  private async playExplosionAnimation(level: Level, explosion1: Explosion, explosion2: Explosion): Promise<void> {
    level.objects.push(explosion1);
    await delay(this.objectExplosionDuration / 3);
    removeElementFromArray(level.objects, explosion1);
    level.objects.push(explosion2);
    await delay(this.objectExplosionDuration / 3);
    removeElementFromArray(level.objects, explosion2);
    level.objects.push(explosion1);
    await delay(this.objectExplosionDuration / 3);
    removeElementFromArray(level.objects, explosion1);
  }

  private revivePlayer(): void {
    this.numberOfLives--;
    this.gameInfo.setNumberOfLives(this.numberOfLives);
    this.player = new Player();
    this.fuel = 1;
    this.gameInfo.fuelIndicator.setHand(this.fuel);
    this.currentLevel.copy(this.currentLevelAtStart);
    this.movePlayerToLevelStart();
  }

  private progressLevel(): void {
    this.scene.remove(this.previousLevel);
    this.previousLevel = this.currentLevel;
    this.currentLevel = this.nextLevel;
    this.currentLevelAtStart.copy(this.currentLevel);
    this.addNextLevel();
  }

  private addNextLevel(): void {
    this.nextLevel = LevelGenerator.generate();
    this.nextLevel.position.set(0, this.currentLevel.position.y - LevelGenerator.levelHeight);
    this.scene.add(this.nextLevel);
  }

  private movePlayerToLevelStart(): void {
    const pos = new Vector2(Canvas.width / 2, this.currentLevel.position.y - LevelGenerator.sectionHeight / 2 + this.runwayMargin);
    this.player.setPosition(pos);
  }

  private updateFuel(delta: number): void {
    this.fuel -= this.fuelConsumptionRate * delta;
    if (this.fuel <= 0) {
      this.gameInfo.fuelIndicator.setHand(0);
      this.destroyPlayer();
    }
    this.gameInfo.fuelIndicator.setHand(this.fuel);
  }

  private async winkRiver(): Promise<void> {
    this.background.backgroundColor = this.riverColorAnomaly;
    await delay(50);
    this.background.backgroundColor = this.riverColorNormal;
    await delay(50);
    this.background.backgroundColor = this.riverColorAnomaly;
    await delay(50);
    this.background.backgroundColor = this.riverColorNormal;
    await delay(50);
    this.background.backgroundColor = this.riverColorAnomaly;
    await delay(50);
    this.background.backgroundColor = this.riverColorNormal;
  }
}