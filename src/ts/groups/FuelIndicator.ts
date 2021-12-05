import CanvasGroup from "../core/CanvasGroup";
import StrokeRectangle from "../objects/StrokeRectangle";

export default class FuelIndicator extends CanvasGroup {
  public width: number;
  public height: number;

  public constructor(width: number, height: number) {
    super();

    this.width = width;
    this.height = height;

    this.addElements();
  }

  private addElements(): void {
    const strokeRectangle = new StrokeRectangle(this.width, this.height, '#000', 5);

    this.objects.push(strokeRectangle);
  }
}