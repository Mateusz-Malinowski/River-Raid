import Canvas from "./core/Canvas";
import Vector2 from "./core/Vector2";
import Line from "./objects/basic/Line";
import Runway from "./objects/image-objects/map/Runway";
import Grass from "./objects/image-objects/map/Grass";
import HouseAndTree from "./objects/image-objects/map/HouseAndTree";
import { getRandomInt, objectsPositionColliding, objectsYAxisColliding } from "./utilities";
import LevelBridge from "./LevelBridge";
import Level from "./Level";
import LevelFuel from "./LevelFuel";
import Ship from "./enemies/Ship";
import Chopper from "./enemies/Chopper";
import { Enemy } from "./enemies/Enemy";
import Rectangle from "./objects/basic/Rectangle";
import Plane from "./enemies/Plane";
import BigMountains from "./objects/image-objects/map/BigMountains";
import SmallMountains from "./objects/image-objects/map/SmallMountains";

export default class LevelGenerator {
  public static levelHeight: number = 8000;
  public static sectionHeight: number = 500; // levelHeight has to be divisible by sectionHeight

  private static riverBorderColor: string = '#280302';
  private static riverBorderWidth: number = 50;
  private static minimalRiverChangeWidth: number = 200;
  private static minimumGrassWidth: number = 100;
  private static riverChangeStepWidth: number = 50;
  private static riverChangeStepHeight: number = 10;
  private static riverMaxAmplitude: number = 100;
  private static riverMaxSingleAmplitude: number = 20;
  private static startingRiverWidth: number = 400;
  private static runwayHeight: number = 200;
  private static houseAndTreeWidth: number = 160;
  private static houseAndTreeHeight: number = 95;
  private static bigMountainsWidth: number = 216;
  private static bigMountainsHeight: number = 66;
  private static smallMountainsWidth: number = 144;
  private static smallMountainsHeight: number = 42;
  private static bridgeWidth: number = LevelGenerator.startingRiverWidth + LevelGenerator.riverBorderWidth;
  private static bridgeHeight: number = LevelGenerator.runwayHeight;
  private static fuelWidth: number = 80;
  private static fuelHeight: number = 144;
  private static shipWidth: number = 192;
  private static shipHeight: number = 48;
  private static chopperWidth: number = 96;
  private static chopperHeight: number = 60;
  private static planeWidth: number = 96;
  private static planeHeight: number = 36;

  private static riverWidth: number;
  private static leftBoundX: number;
  private static rightBoundX: number;
  private static currentLeftBoundX: number;
  private static currentRightBoundX: number;
  private static sectionPositionY: number;
  private static amplitude: number = 0;
  private static amplitudeDirection: string = 'right';

  public static init(): void {
    this.currentLeftBoundX = Canvas.width / 2 - LevelGenerator.startingRiverWidth / 2;
    this.currentRightBoundX = Canvas.width / 2 + LevelGenerator.startingRiverWidth / 2;
  }

  public static generate(): Level {
    this.changeRiverWidth(this.startingRiverWidth);

    const level = new Level();

    for (let i = 0; i < this.levelHeight / this.sectionHeight; i++) {
      this.sectionPositionY = -this.sectionHeight * (i + 1);

      if (i == 0) {
        this.addGrassToSection(level, this.riverBorderWidth / 2);
      }
      else {
        this.addGrassToSection(level, this.riverMaxAmplitude);
      }

      const enoughPlaceForMountains = (Canvas.width - this.riverWidth - this.riverMaxAmplitude) / 2 > this.bigMountainsWidth;
      const generateMountains = getRandomInt(0, 5) == 0 ? true : false; // 25 %
      if (i != 0 && enoughPlaceForMountains && generateMountains) {
        const numberOfMountains = getRandomInt(1, 4); // 1 - 3 houses
        this.addMountainsToSection(level, numberOfMountains);
      }


      if (i == this.levelHeight / this.sectionHeight - 1) { // last section
        this.transitionRiverWidth(level, this.startingRiverWidth);
      }
      else {
        const changeRiverWidth = getRandomInt(0, 2); // 50%
        if (changeRiverWidth)
          this.transitionRiverWidth(level);
      }
    }

    this.addRunwayToLevel(level);
    this.addBridgeToLevel(level);

    const numberOfFuelBarrels = getRandomInt(5, 16);
    this.addFuelBarrelsToLevel(level, numberOfFuelBarrels);

    const numberOfShipsAndChoppers = getRandomInt(2, 11);
    this.addShipsAndChoppersToLevel(level, numberOfShipsAndChoppers);

    const numberOfPlanes = getRandomInt(4, 10);
    this.addPlanesToLevel(level, numberOfPlanes);

    return level;
  }

  private static changeRiverWidth(riverWidth: number): void {
    this.riverWidth = riverWidth;
    this.leftBoundX = Canvas.width / 2 - this.riverWidth / 2;
    this.rightBoundX = Canvas.width / 2 + this.riverWidth / 2;
  }

  private static getRandomRiverWidth(): number {
    const maxRiverWidths = (Canvas.width - this.minimumGrassWidth * 2) / this.minimalRiverChangeWidth;
    const countOfRiverWidths = getRandomInt(2, maxRiverWidths);
    const newRiverWidth = countOfRiverWidths * this.minimalRiverChangeWidth;

    return newRiverWidth;
  }

  private static addRunwayToLevel(level: Level): void {
    const startingLeftBoundX = Canvas.width / 2 - this.startingRiverWidth / 2;
    const startingRightBoundX = Canvas.width / 2 + this.startingRiverWidth / 2;

    const leftRunway = new Runway(startingLeftBoundX + this.riverBorderWidth / 2, this.runwayHeight);
    const rightRunway = new Runway(Canvas.width - startingRightBoundX + this.riverBorderWidth / 2, this.runwayHeight);

    // position at the center of the first section
    leftRunway.position.set(0, -(this.sectionHeight / 2) - this.runwayHeight / 2);
    rightRunway.position.set(startingRightBoundX - this.riverBorderWidth / 2, -(this.sectionHeight / 2) - this.runwayHeight / 2);

    level.objects.push(leftRunway, rightRunway);
    level.staticObjects.push(leftRunway, rightRunway);
  }

  private static addBridgeToLevel(level: Level): LevelBridge {
    const bridge = new LevelBridge(this.bridgeWidth, this.bridgeHeight);
    bridge.position.set(this.leftBoundX - this.riverBorderWidth / 2, -(this.sectionHeight / 2) - this.runwayHeight / 2);
    bridge.zIndex = 2;

    level.objects.push(bridge);
    level.bridge = bridge;

    return bridge;
  }

  private static addGrassToSection(level: Level, maxRiverAmplitude: number): void {
    let previousAmplitude = this.amplitude;

    for (let i = 0; i < this.sectionHeight / this.riverChangeStepHeight; i++) {
      const positionY = this.sectionPositionY + this.sectionHeight - i * this.riverChangeStepHeight;
      let amplitudeChange = this.currentLeftBoundX == this.leftBoundX ? getRandomInt(0, this.riverMaxSingleAmplitude + 1) : 0;

      if (this.currentLeftBoundX > this.leftBoundX) {
        this.currentLeftBoundX -= this.riverChangeStepWidth;
        this.currentRightBoundX += this.riverChangeStepWidth;
        if (this.currentLeftBoundX < this.leftBoundX)
          this.currentLeftBoundX = this.leftBoundX;
      }
      else if (this.currentLeftBoundX < this.leftBoundX) {
        this.currentLeftBoundX += this.riverChangeStepWidth;
        this.currentRightBoundX -= this.riverChangeStepWidth;
        if (this.currentLeftBoundX > this.leftBoundX)
          this.currentLeftBoundX = this.leftBoundX;
      }

      if (this.amplitudeDirection == 'right') {
        this.amplitude = previousAmplitude + amplitudeChange;
        if (this.amplitude > maxRiverAmplitude) {
          this.amplitude = maxRiverAmplitude;
          this.amplitudeDirection = 'left';
        }
      }
      else {
        this.amplitude = previousAmplitude - amplitudeChange;
        if (this.amplitude < -maxRiverAmplitude) {
          this.amplitude = -maxRiverAmplitude;
          this.amplitudeDirection = 'right';
        }
      }

      const leftGrassWidth = this.currentLeftBoundX + this.amplitude;
      const rightGrassWidth = Canvas.width - this.currentRightBoundX - this.amplitude;

      const leftGrass = new Grass(leftGrassWidth, this.riverChangeStepHeight);
      const rightGrass = new Grass(rightGrassWidth, this.riverChangeStepHeight);
      const leftRiverBorder = new Rectangle(this.riverBorderWidth, this.riverChangeStepHeight, this.riverBorderColor);
      const rightRiverBorder = new Rectangle(this.riverBorderWidth, this.riverChangeStepHeight, this.riverBorderColor);

      leftGrass.position.set(0, positionY);
      rightGrass.position.set(this.currentRightBoundX + this.amplitude, positionY);
      leftRiverBorder.position.set(leftGrassWidth, positionY);
      rightRiverBorder.position.set(rightGrass.position.x - this.riverBorderWidth, positionY);
      leftRiverBorder.zIndex = 1;
      rightRiverBorder.zIndex = 1;

      level.objects.push(leftGrass, rightGrass, leftRiverBorder, rightRiverBorder);
      level.staticObjects.push(leftGrass, rightGrass, leftRiverBorder, rightRiverBorder);

      previousAmplitude = this.amplitude;
    }
  }

  private static addHousesToSection(level: Level, count: number): void {
    const houses: HouseAndTree[] = [];

    for (let i = 0; i < count; i++) {
      const isOnLeftSide = getRandomInt(0, 2) == 0 ? false : true; // 50%
      const isInverted = getRandomInt(0, 2) == 0 ? false : true; // 50%
      const houseAndTree = new HouseAndTree(this.houseAndTreeWidth, this.houseAndTreeHeight, isInverted);

      const minPositionY = this.sectionPositionY;
      const maxPositionY = this.sectionPositionY + this.sectionHeight - this.houseAndTreeHeight;
      let minPositionX, maxPositionX, positionX, positionY;
      if (isOnLeftSide) {
        minPositionX = 0;
        maxPositionX = this.leftBoundX - this.houseAndTreeWidth;
      }
      else {
        minPositionX = this.rightBoundX;
        maxPositionX = Canvas.width - this.houseAndTreeWidth;
      }

      let isColliding;
      do {
        isColliding = false;
        positionX = getRandomInt(minPositionX, maxPositionX);
        positionY = getRandomInt(minPositionY, maxPositionY);
        houseAndTree.position.set(positionX, positionY);

        for (const house of houses) {
          if (objectsPositionColliding(houseAndTree, house)) {
            isColliding = true;
            break;
          }
        }
      } while (isColliding);

      houses.push(houseAndTree);
    }
    level.objects.push(...houses);
    level.staticObjects.push(...houses);
  }

  private static addMountainsToSection(level: Level, count: number): void {
    const mountainsObjects: Array<BigMountains | SmallMountains> = [];

    for (let i = 0; i < count; i++) {
      const isOnLeftSide = getRandomInt(0, 2) == 0 ? false : true; // 50%
      const smallMountains = getRandomInt(0, 2) == 0 ? false : true; // 50%
      let mountains;
      if (smallMountains)
        mountains = new SmallMountains(this.smallMountainsWidth, this.smallMountainsHeight);
      else
        mountains = new BigMountains(this.bigMountainsWidth, this.bigMountainsHeight);

      const minPositionY = this.sectionPositionY;
      const maxPositionY = this.sectionPositionY + this.sectionHeight - mountains.height;

      let minPositionX, maxPositionX, positionX, positionY;
      if (isOnLeftSide) {
        minPositionX = 0;
        maxPositionX = this.leftBoundX - this.riverMaxAmplitude - mountains.width;
      }
      else {
        minPositionX = this.rightBoundX + this.riverMaxAmplitude;
        maxPositionX = Canvas.width - mountains.width;
      }

      let isColliding;
      do {
        isColliding = false;
        positionX = getRandomInt(minPositionX, maxPositionX);
        positionY = getRandomInt(minPositionY, maxPositionY);
        mountains.position.set(positionX, positionY);

        for (const existingMountains of mountainsObjects) {
          if (objectsPositionColliding(mountains, existingMountains)) {
            isColliding = true;
            break;
          }
        }
      } while (isColliding);

      mountainsObjects.push(mountains);
    }
    level.objects.push(...mountainsObjects);
    level.staticObjects.push(...mountainsObjects);
  }

  private static addFuelBarrelsToLevel(level: Level, count: number): void {
    const fuelBarrels: LevelFuel[] = [];

    for (let i = 0; i < count; i++) {
      const fuelBarrel = new LevelFuel(this.fuelWidth, this.fuelHeight);

      const minPositionX = this.minimumGrassWidth;
      const maxPositionX = Canvas.width - fuelBarrel.width - this.minimumGrassWidth;
      const minPositionY = -this.levelHeight;
      const maxPositionY = 0 - fuelBarrel.height - this.sectionHeight;

      let isColliding, positionX, positionY;

      do {
        isColliding = false;
        positionX = getRandomInt(minPositionX, maxPositionX + 1);
        positionY = getRandomInt(minPositionY, maxPositionY + 1);
        fuelBarrel.position.set(positionX, positionY);

        for (const existingBarrel of fuelBarrels) {
          if (objectsPositionColliding(existingBarrel, fuelBarrel)) {
            isColliding = true;
            break;
          }
        }

        for (const object of level.objects) {
          if (objectsPositionColliding(object, fuelBarrel)) {
            isColliding = true;
            break;
          }
        }
      } while (isColliding);

      fuelBarrels.push(fuelBarrel);
    }

    level.objects.push(...fuelBarrels);
    level.fuelBarrels.push(...fuelBarrels);
  }

  private static addShipsAndChoppersToLevel(level: Level, count: number): void {
    const shipsAndChoppers: Enemy[] = [];

    for (let i = 0; i < count; i++) {
      const isShip = getRandomInt(0, 2) == 0 ? false : true;
      let enemy;
      if (isShip)
        enemy = new Ship(this.shipWidth, this.shipHeight);
      else
        enemy = new Chopper(this.chopperWidth, this.chopperHeight);

      const minPositionX = this.minimumGrassWidth;
      const maxPositionX = Canvas.width - enemy.width - this.minimumGrassWidth;
      const minPositionY = -this.levelHeight;
      const maxPositionY = 0 - enemy.height - this.sectionHeight;

      let isColliding, positionX, positionY;
      do {
        isColliding = false;
        positionX = getRandomInt(minPositionX, maxPositionX + 1);
        positionY = getRandomInt(minPositionY, maxPositionY + 1);
        enemy.position.set(positionX, positionY);

        for (const existingShip of shipsAndChoppers) {
          if (objectsYAxisColliding(existingShip, enemy)) {
            isColliding = true;
            break;
          }
        }

        for (const object of level.objects) {
          if (objectsPositionColliding(object, enemy)) {
            isColliding = true;
            break;
          }
        }
      } while (isColliding);

      shipsAndChoppers.push(enemy);
    }

    level.objects.push(...shipsAndChoppers);
    level.enemyObjects.push(...shipsAndChoppers);
  }

  private static addPlanesToLevel(level: Level, count: number): void {
    const planes: Plane[] = [];

    for (let i = 0; i < count; i++) {
      const plane = new Plane(this.planeWidth, this.planeHeight);
      const minPositionY = -this.levelHeight;
      const maxPositionY = 0 - plane.height - this.sectionHeight;
      const positionX = Canvas.width;

      let isColliding, positionY;
      do {
        isColliding = false;
        positionY = getRandomInt(minPositionY, maxPositionY + 1);
        plane.position.set(positionX, positionY);

        for (const existingPlane of planes) {
          if (objectsYAxisColliding(existingPlane, plane)) {
            isColliding = true;
            break;
          }
        }
      } while (isColliding);

      planes.push(plane);
    }

    level.objects.push(...planes);
    level.enemyObjects.push(...planes);
  }

  private static addBoundsToSection(level: Level): void {
    const leftBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
    const rightBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
    leftBoundLine.position.set(this.leftBoundX, this.sectionPositionY);
    rightBoundLine.position.set(this.rightBoundX, this.sectionPositionY);

    level.objects.push(leftBoundLine, rightBoundLine);
  }

  private static transitionRiverWidth(level: Level, newWidth?: number): void {
    let newRiverWidth = newWidth;
    if (!newRiverWidth)
      newRiverWidth = this.getRandomRiverWidth();

    this.changeRiverWidth(newRiverWidth);
  }
}