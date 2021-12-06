import Assets from "../core/Assets";
import Canvas from "../core/Canvas";
import CanvasGroup from "../core/CanvasGroup";
import Vector2 from "../core/Vector2";
import ImageObject from "../objects/ImageObject";
import Line from "../objects/Line";
import Rectangle from "../objects/Rectangle";
import Text from "../objects/Text";
import FuelIndicator from "./FuelIndicator";

export default class GameInfo extends CanvasGroup {
  public height: number;

  private logoWidth: number = 256;
  private logoHeight: number = 62;
  private fuelIndicatorWidth: number = 350;
  private fuelIndicatorHeight: number = 80;
  
  public fuelIndicator: FuelIndicator;
  private scoreText: Text;
  private numberOfLivesText: Text;

  public constructor(height: number) {
    super();

    this.height = height;

    this.addElements();
  }

  public setScore(score: number): void {
    this.scoreText.content = score.toString();
  }

  public setNumberOfLives(numberOfLives: number): void {
    this.numberOfLivesText.content = numberOfLives.toString();
  }

  private addElements(): void {
    const background = new Rectangle(Canvas.width, this.height, '#5b5866');
    const line = new Line(new Vector2(Canvas.width), 3);
    const logo = new ImageObject(Assets.images.activision, this.logoWidth, this.logoHeight);

    this.scoreText = new Text('', '#f1b91c', 'bold 80px arial', 'top', 'right');
    this.fuelIndicator = new FuelIndicator(this.fuelIndicatorWidth, this.fuelIndicatorHeight);
    this.numberOfLivesText = new Text('', '#f1b91c', 'bold 80px arial', 'bottom', 'right');

    logo.position.set(Canvas.width / 2 + this.fuelIndicatorWidth / 2 - this.logoWidth, this.height - this.logoHeight - 10);
    this.scoreText.position.set(Canvas.width / 2 + this.fuelIndicatorWidth / 2, 5);
    this.fuelIndicator.position.set(Canvas.width / 2 - this.fuelIndicatorWidth / 2, 80);
    this.numberOfLivesText.position.set(Canvas.width / 2 - this.fuelIndicatorWidth / 2 - 5, this.height);

    this.groups.push(this.fuelIndicator);
    this.objects.push(background, line, logo, this.scoreText, this.numberOfLivesText);
  }
}