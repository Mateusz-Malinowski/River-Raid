import Canvas from "./core/Canvas";
import CanvasGroup from "./core/CanvasGroup";
import Vector2 from "./core/Vector2";
import Line from "./objects/basic/Line";
import Runway from "./objects/image-objects/map/Runway";
import Grass from "./objects/image-objects/map/Grass";
import HouseAndTree from "./objects/image-objects/map/HouseAndTree";
import CanvasObject from "./core/CanvasObject";
import { getRandomInt, objectsPositionColliding } from "./utilities";
import Bridge from "./objects/image-objects/map/Bridge";
import LevelBridge from "./LevelBridge";
import Fuel from "./objects/image-objects/map/Fuel";
import Level from "./Level";
import LevelFuel from "./LevelFuel";

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

  private static riverWidth: number;
  private static leftBoundX: number;
  private static rightBoundX: number;
  private static sectionPositionY: number;

  public static generate(): Level {
    this.changeRiverWidth(this.startingRiverWidth);

    const level = new Level();

    for (let i = 0; i < this.levelHeight / this.sectionHeight; i++) {
      this.sectionPositionY = -this.sectionHeight * (i + 1);

      level.staticObjects.push(...this.addGrassToSection(level));

      const enoughPlaceForHouses = (Canvas.width - this.riverWidth) / 2 > this.houseAndTreeWidth;
      const generateHouses = getRandomInt(0, 5) == 0 ? true : false; // 25 %
      if (i != 0 && enoughPlaceForHouses && generateHouses) {
        const numberOfHouses = getRandomInt(1, 4); // 1 - 3 houses
        level.staticObjects.push(...this.addHousesToSection(level, numberOfHouses));
      }

      if (i == this.levelHeight / this.sectionHeight - 1) { // last section
        level.staticObjects.push(...this.transitionRiverWidth(level, this.startingRiverWidth));
      }
      else {
        const changeRiverWidth = getRandomInt(0, 2); // 50%
        if (changeRiverWidth)
          level.staticObjects.push(...this.transitionRiverWidth(level));
      }
    }

    level.staticObjects.push(...this.addRunwayToLevel(level));
    level.bridge = this.addBridgeToLevel(level);

    const numberOfFuelBarrels = getRandomInt(5, 16);
    level.fuelBarrels.push(...this.addFuelBarrelsToLevel(level, numberOfFuelBarrels));

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

  private static addRunwayToLevel(group: CanvasGroup): Runway[] {
    const startingLeftBoundX = Canvas.width / 2 - this.startingRiverWidth / 2;
    const startingRightBoundX = Canvas.width / 2 + this.startingRiverWidth / 2;

    const leftRunway = new Runway(startingLeftBoundX, this.runwayHeight);
    const rightRunway = new Runway(Canvas.width - startingRightBoundX, this.runwayHeight);

    // position at the center of the first section
    leftRunway.position.set(0, -(this.sectionHeight / 2) - this.runwayHeight / 2);
    rightRunway.position.set(startingRightBoundX, -(this.sectionHeight / 2) - this.runwayHeight / 2);

    group.objects.push(leftRunway, rightRunway);

    return [leftRunway, rightRunway];
  }

  private static addBridgeToLevel(group: CanvasGroup): LevelBridge {
    const bridge = new LevelBridge(this.bridgeWidth, this.bridgeHeight);
    bridge.position.set(this.leftBoundX, -(this.sectionHeight / 2) - this.runwayHeight / 2);

    group.objects.push(bridge);

    return bridge;
  }

  private static addGrassToSection(group: CanvasGroup): Grass[] {
    const leftGrass = new Grass(this.leftBoundX, this.sectionHeight);
    const rightGrass = new Grass(Canvas.width - this.rightBoundX, this.sectionHeight);
    leftGrass.position.set(0, this.sectionPositionY);
    rightGrass.position.set(this.rightBoundX, this.sectionPositionY);

    group.objects.push(leftGrass, rightGrass);

    return [leftGrass, rightGrass];
  }

  private static addHousesToSection(group: CanvasGroup, count: number): HouseAndTree[] {
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
    group.objects.push(...houses);
    return houses;
  }

  private static addFuelBarrelsToLevel(group: CanvasGroup, count: number): LevelFuel[] {
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

        for (const object of group.objects) {
          if (objectsPositionColliding(object, fuelBarrel)) {
            isColliding = true;
            break;
          }
        }
      } while (isColliding);

      fuelBarrels.push(fuelBarrel);
    }

    group.objects.push(...fuelBarrels);

    return fuelBarrels;
  }

  private static addBoundsToSection(group: CanvasGroup): void {
    const leftBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
    const rightBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
    leftBoundLine.position.set(this.leftBoundX, this.sectionPositionY);
    rightBoundLine.position.set(this.rightBoundX, this.sectionPositionY);

    group.objects.push(leftBoundLine, rightBoundLine);
  }

  private static transitionRiverWidth(group: CanvasGroup, newWidth?: number): Grass[] {
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

    group.objects.push(...stepGrasses);

    return stepGrasses;
  }
}