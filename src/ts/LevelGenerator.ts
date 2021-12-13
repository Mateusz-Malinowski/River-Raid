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

export default class LevelGenerator {
  public static levelHeight: number = 8000;
  public static sectionHeight: number = 500; // levelHeight has to be divisible by sectionHeight

  private static minimalRiverChangeWidth: number = 200;
  private static minimumGrassWidth: number = 100;
  private static riverChangeStepWidth: number = 50;
  private static riverChangeStepHeight: number = 10;
  private static startingRiverWidth: number = 400;
  private static runwayHeight: number = 200;
  private static houseAndTreeWidth: number = 160;
  private static houseAndTreeHeight: number = 95;
  private static bridgeWidth: number = LevelGenerator.startingRiverWidth;
  private static bridgeHeight: number = LevelGenerator.runwayHeight;
  private static fuelWidth: number = 80;
  private static fuelHeight: number = 144;
  private static shipWidth: number = 192;
  private static shipHeight: number = 48;
  private static chopperWidth: number = 96;
  private static chopperHeight: number = 60;

  private static riverWidth: number;
  private static leftBoundX: number;
  private static rightBoundX: number;
  private static sectionPositionY: number;

  public static generate(): Level {
    this.changeRiverWidth(this.startingRiverWidth);

    const level = new Level();

    for (let i = 0; i < this.levelHeight / this.sectionHeight; i++) {
      this.sectionPositionY = -this.sectionHeight * (i + 1);

      this.addGrassToSection(level);

      const enoughPlaceForHouses = (Canvas.width - this.riverWidth) / 2 > this.houseAndTreeWidth;
      const generateHouses = getRandomInt(0, 5) == 0 ? true : false; // 25 %
      if (i != 0 && enoughPlaceForHouses && generateHouses) {
        const numberOfHouses = getRandomInt(1, 4); // 1 - 3 houses
        this.addHousesToSection(level, numberOfHouses);
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

    return level;
  }

  private static changeRiverWidth(riverWidth: number): void {
    this.riverWidth = riverWidth;
    this.leftBoundX = Canvas.width / 2 - this.riverWidth / 2;
    this.rightBoundX = Canvas.width / 2 + this.riverWidth / 2;
  }

  private static getRandomRiverWidth(): number {
    const maxRiverWidths = (Canvas.width - this.minimumGrassWidth * 2) / this.minimalRiverChangeWidth;
    const countOfRiverWidths = getRandomInt(1, maxRiverWidths + 1);
    const newRiverWidth = countOfRiverWidths * this.minimalRiverChangeWidth;

    return newRiverWidth;
  }

  private static addRunwayToLevel(level: Level): void {
    const startingLeftBoundX = Canvas.width / 2 - this.startingRiverWidth / 2;
    const startingRightBoundX = Canvas.width / 2 + this.startingRiverWidth / 2;

    const leftRunway = new Runway(startingLeftBoundX, this.runwayHeight);
    const rightRunway = new Runway(Canvas.width - startingRightBoundX, this.runwayHeight);

    // position at the center of the first section
    leftRunway.position.set(0, -(this.sectionHeight / 2) - this.runwayHeight / 2);
    rightRunway.position.set(startingRightBoundX, -(this.sectionHeight / 2) - this.runwayHeight / 2);

    level.objects.push(leftRunway, rightRunway);
    level.staticObjects.push(leftRunway, rightRunway);
  }

  private static addBridgeToLevel(level: Level): LevelBridge {
    const bridge = new LevelBridge(this.bridgeWidth, this.bridgeHeight);
    bridge.position.set(this.leftBoundX, -(this.sectionHeight / 2) - this.runwayHeight / 2);

    level.objects.push(bridge);
    level.bridge = bridge;

    return bridge;
  }

  private static addGrassToSection(level: Level): void {
    const leftGrass = new Grass(this.leftBoundX, this.sectionHeight);
    const rightGrass = new Grass(Canvas.width - this.rightBoundX, this.sectionHeight);
    leftGrass.position.set(0, this.sectionPositionY);
    rightGrass.position.set(this.rightBoundX, this.sectionPositionY);

    level.objects.push(leftGrass, rightGrass);
    level.staticObjects.push(leftGrass, rightGrass);
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

  private static addBoundsToSection(level: Level): void {
    const leftBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
    const rightBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
    leftBoundLine.position.set(this.leftBoundX, this.sectionPositionY);
    rightBoundLine.position.set(this.rightBoundX, this.sectionPositionY);

    level.objects.push(leftBoundLine, rightBoundLine);
  }

  private static transitionRiverWidth(level: Level, newWidth?: number): void {
    const stepGrasses: Grass[] = [];

    const oldRiverWidth = this.riverWidth;
    const oldRightBoundX = this.rightBoundX;
    const oldLeftBoundX = this.leftBoundX;

    let newRiverWidth = newWidth;
    if (!newRiverWidth)
      newRiverWidth = this.getRandomRiverWidth();

    this.changeRiverWidth(newRiverWidth);

    const halfDifference = (newRiverWidth - oldRiverWidth) / 2;
    const countOfSteps = Math.abs(halfDifference) / this.riverChangeStepWidth;

    for (let i = 1; i <= countOfSteps; i++) {
      const stepGrassWidth = Math.abs(halfDifference) - i * this.riverChangeStepWidth;
      const leftStepGrass = new Grass(stepGrassWidth, this.riverChangeStepHeight);
      const rightStepGrass = new Grass(stepGrassWidth, this.riverChangeStepHeight);

      let stepGrassPosY;
      if (halfDifference > 0) {
        stepGrassPosY = this.sectionPositionY - i * this.riverChangeStepHeight;
        leftStepGrass.position.set(this.leftBoundX, stepGrassPosY);
        rightStepGrass.position.set(oldRightBoundX + i * this.riverChangeStepWidth, stepGrassPosY);
      }
      else {
        stepGrassPosY = this.sectionPositionY + (i - 1) * this.riverChangeStepHeight;
        leftStepGrass.position.set(oldLeftBoundX, stepGrassPosY);
        rightStepGrass.position.set(this.rightBoundX + i * this.riverChangeStepWidth, stepGrassPosY);
      }

      stepGrasses.push(leftStepGrass, rightStepGrass);
    }

    level.objects.push(...stepGrasses);
    level.staticObjects.push(...stepGrasses);
  }
}