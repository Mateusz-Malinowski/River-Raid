import Canvas from "./core/Canvas";
import CanvasGroup from "./core/CanvasGroup";
import Vector2 from "./core/Vector2";
import Line from "./objects/basic/Line";
import Runway from "./objects/image-objects/map/Runway";
import Grass from "./objects/image-objects/map/Grass";
import HouseAndTree from "./objects/image-objects/map/HouseAndTree";
import CanvasObject from "./core/CanvasObject";
import { getRandomInt, objectsColliding } from "./utilities";

export default class MapGenerator {
  public static levelHeight: number = 12000;
  
  private static sectionHeight: number = 500;
  private static minimalRiverChangeWidth: number = 200;
  private static minimumGrassWidth: number = 100;
  private static riverChangeStepWidth: number = 50;
  private static riverChangeStepHeight: number = 10;
  private static runwayOffset: number = 15;
  private static startingRiverWidth: number = 400;
  private static runwayHeight: number = 200;
  private static houseAndTreeWidth: number = 160;
  private static houseAndTreeHeight: number = 95;

  private static riverWidth: number;
  private static leftBoundX: number;
  private static rightBoundX: number;
  private static sectionPositionY: number;

  public static generateLevel(): CanvasGroup {
    this.changeRiverWidth(this.startingRiverWidth);

    const group = new CanvasGroup();

    for (let i = 0; i < this.levelHeight / this.sectionHeight; i++) {
      this.sectionPositionY = -this.sectionHeight * (i + 1);

      this.addGrassToSection(group);

      const enoughPlaceForHouses = (Canvas.width - this.riverWidth) / 2 > this.houseAndTreeWidth;
      const generateHouses = getRandomInt(0, 5) == 0 ? true : false; // 25 %
      if (i != 0 && enoughPlaceForHouses && generateHouses) {
        const numberOfHouses = getRandomInt(1, 4); // 1 - 3 houses
        this.addHousesToSection(group, numberOfHouses);
      }

      const changeRiverWidth = getRandomInt(0, 2); // 50%
      if (changeRiverWidth)
        this.transitionRiverWidth(group);
    }

    this.addRunwayToLevel(group);

    return group;
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

  private static addRunwayToLevel(group: CanvasGroup): void {
    const startingLeftBoundX = Canvas.width / 2 - this.startingRiverWidth / 2;
    const startingRightBoundX = Canvas.width / 2 + this.startingRiverWidth / 2;

    const leftRunway = new Runway(startingLeftBoundX, this.runwayHeight);
    const rightRunway = new Runway(Canvas.width - startingRightBoundX, this.runwayHeight);
    leftRunway.position.set(0, 0 - leftRunway.height - this.runwayOffset);
    rightRunway.position.set(startingRightBoundX, 0 - rightRunway.height - this.runwayOffset);

    group.objects.push(leftRunway, rightRunway);
  }

  private static addGrassToSection(group: CanvasGroup): void {
    const leftGrass = new Grass(this.leftBoundX, this.sectionHeight);
    const rightGrass = new Grass(Canvas.width - this.rightBoundX, this.sectionHeight);
    leftGrass.position.set(0, this.sectionPositionY);
    rightGrass.position.set(this.rightBoundX, this.sectionPositionY);

    group.objects.push(leftGrass, rightGrass);
  }

  private static addHousesToSection(group: CanvasGroup, count: number): void {
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
          if (objectsColliding(houseAndTree, house)) {
            isColliding = true;
            break;
          }
        }
      } while(isColliding);

      houses.push(houseAndTree);
    }
    group.objects.push(...houses);
  }

  private static addBoundsToSection(group: CanvasGroup): void {
    const leftBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
    const rightBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
    leftBoundLine.position.set(this.leftBoundX, this.sectionPositionY);
    rightBoundLine.position.set(this.rightBoundX, this.sectionPositionY);

    group.objects.push(leftBoundLine, rightBoundLine);
  }

  private static transitionRiverWidth(group: CanvasGroup): void {
    const oldRiverWidth = this.riverWidth;
    const oldRightBoundX = this.rightBoundX;
    const oldLeftBoundX = this.leftBoundX;

    const newRiverWidth = this.getRandomRiverWidth();
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

      group.objects.push(leftStepGrass, rightStepGrass);
    }
  }
}