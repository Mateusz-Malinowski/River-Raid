import CanvasGroup from "./core/CanvasGroup";
import CanvasObject from "./core/CanvasObject";
import LevelBridge from "./LevelBridge";
import LevelFuel from "./LevelFuel";

export default class Level extends CanvasGroup {
  public bridge: LevelBridge = null;
  public staticObjects: CanvasObject[] = [];
  public fuelBarrels: LevelFuel[] = [];

  public copy(level: Level): void {
    this.bridge = level.bridge;
    this.objects = [...level.objects];
    this.staticObjects = [...level.staticObjects];
    this.fuelBarrels = [...level.fuelBarrels];
  }
}