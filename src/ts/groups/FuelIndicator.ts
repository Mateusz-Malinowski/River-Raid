import CanvasGroup from "../core/CanvasGroup";
import Vector2 from "../core/Vector2";
import Line from "../objects/Line";
import Rectangle from "../objects/Rectangle";
import StrokeRectangle from "../objects/StrokeRectangle";
import Text from "../objects/Text";

export default class FuelIndicator extends CanvasGroup {
  public width: number;
  public height: number;
  
  private hand: Rectangle;
  private color: string = '#000';
  private strokeWidth: number = 6;
  private thresholdWidth: number = 20;
  private thresholdHeight: number = 20;
  private halfThresholdWidth: number = 8;
  private halfThresholdHeight: number = 15;
  private halfLineWidth: number = 10;
  private handWidth: number = this.thresholdWidth;
  private handHeight: number;
  private handColor: string = '#f2ba1d';

  public constructor(width: number, height: number) {
    super();

    this.width = width;
    this.height = height;
    this.handHeight = this.height - this.thresholdHeight;

    this.addElements();
  }

  public setHand(fraction: number): void {
    const maxValue = this.width - this.handWidth;
    this.hand.position.set(fraction * maxValue, this.hand.position.y);
  }

  private addElements(): void {
    const border = new StrokeRectangle(this.width, this.height, this.color, 6);
    const emptyThreshold = new Rectangle(this.thresholdWidth, this.thresholdHeight, this.color);
    const halfThreshold = new Rectangle(this.halfThresholdWidth, this.halfThresholdHeight, this.color);
    const fullThreshold = new Rectangle(this.thresholdWidth, this.thresholdHeight, this.color);
    const emptyText = new Text('E', this.color, 'bold 64px arial', 'top', 'left');
    const fullText = new Text('F', this.color, 'bold 64px arial', 'top', 'right');
    const halfText1 = new Text('1', this.color, 'bold 40px arial', 'top');
    const halfLine = new Line(new Vector2(45, -45), this.halfLineWidth);
    const halfText2 = new Text('2', this.color, 'bold 40px arial', 'top');
    this.hand = new Rectangle(this.handWidth, this.handHeight, this.handColor);

    emptyThreshold.position.set(20, 0);
    halfThreshold.position.set(this.width / 2 - this.halfThresholdWidth / 2, 0);
    fullThreshold.position.set(this.width - this.thresholdWidth - 20, 0);
    emptyText.position.set(15, this.thresholdHeight + 2);
    fullText.position.set(this.width - 25, this.thresholdHeight + 2);
    halfText1.position.set(this.width / 2 - 30, this.thresholdHeight - 8);
    halfLine.position.set(this.width / 2 - 20, this.thresholdHeight + 45);
    halfText2.position.set(this.width / 2 + 8, this.thresholdHeight + 18);
    this.hand.position.set(this.width - this.handWidth, this.height - this.handHeight);

    this.objects.push(this.hand, border, emptyThreshold, halfThreshold, fullThreshold, emptyText, fullText, halfText1, halfLine, halfText2);
  }
}