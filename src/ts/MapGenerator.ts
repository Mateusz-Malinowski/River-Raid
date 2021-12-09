import Canvas from "./core/Canvas";
import CanvasGroup from "./core/CanvasGroup";
import Vector2 from "./core/Vector2";
import Line from "./objects/basic/Line";
import Runway from "./objects/image-objects/map/Runway";
import Grass from "./objects/image-objects/map/Grass";
import HouseAndTree from "./objects/image-objects/map/HouseAndTree";
import CanvasObject from "./core/CanvasObject";

export default class MapGenerator {
  private static levelHeight: number = 12000;
  private static sectionHeight: number = 200;
  private static minimalRiverChangeWidth: number = 200;
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

  public static generate(): CanvasGroup {
    return this.generateLevel();
  }

  private static changeRiverWidth(riverWidth: number): void {
    this.riverWidth = riverWidth;
    this.leftBoundX = Canvas.width / 2 - this.riverWidth / 2;
    this.rightBoundX = Canvas.width / 2 + this.riverWidth / 2;
  }

  private static generateLevel(): CanvasGroup {
    this.changeRiverWidth(this.startingRiverWidth);

    const group = new CanvasGroup();
    
    for (let i = 0; i < this.levelHeight / this.sectionHeight; i++) {
      const sectionPositionY = -this.sectionHeight * (i + 1);

      const leftBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
      const rightBoundLine = new Line(new Vector2(0, this.sectionHeight), 5);
      leftBoundLine.position.set(this.leftBoundX, sectionPositionY);
      rightBoundLine.position.set(this.rightBoundX, sectionPositionY);

      const leftGrass = new Grass(this.leftBoundX, this.sectionHeight);
      const rightGrass = new Grass(Canvas.width - this.rightBoundX, this.sectionHeight);
      leftGrass.position.set(0, sectionPositionY);
      rightGrass.position.set(this.rightBoundX, sectionPositionY);

      group.objects.push(leftGrass, rightGrass);

      if (i != 0) {
        const oldRiverWidth = this.riverWidth;
        const oldRightBoundX = this.rightBoundX;
        const newRiverWidth = this.getRandomRiverWidth();
        this.changeRiverWidth(newRiverWidth);
        const halfDifference = (newRiverWidth - oldRiverWidth) / 2;
        const countOfSteps = halfDifference / this.riverChangeStepWidth;
        for (let j = 1; j <= countOfSteps; j++) {
          const stepGrassWidth = halfDifference - j * this.riverChangeStepWidth;
          const stepGrassPosY = sectionPositionY - j * this.riverChangeStepHeight;

          const leftStepGrass = new Grass(stepGrassWidth, this.riverChangeStepHeight);
          leftStepGrass.position.set(this.leftBoundX, stepGrassPosY);
          const rightStepGrass = new Grass(stepGrassWidth, this.riverChangeStepHeight);
          rightStepGrass.position.set(oldRightBoundX + j * this.riverChangeStepWidth, stepGrassPosY);
          group.objects.push(leftStepGrass, rightStepGrass);
        }
      }

      this.addRunwayToLevel(group);

      group.objects.push(leftBoundLine, rightBoundLine);
    }

    return group;
  }

  private static getRandomRiverWidth(): number {
    const maxRiverWidths = Canvas.width / this.minimalRiverChangeWidth;
    const countOfRiverWidths = Math.floor(Math.random() * maxRiverWidths) + 1;
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
}