import CanvasGroup from "./core/CanvasGroup";
import CanvasObject from "./core/CanvasObject";
import { Enemy } from "./enemies/Enemy";
import LevelBridge from "./LevelBridge";
import LevelFuel from "./LevelFuel";
import ImageObject from "./objects/ImageObject";

export default class Level extends CanvasGroup {
  public bridge: LevelBridge = null;
  public staticObjects: CanvasObject[] = [];
  public fuelBarrels: LevelFuel[] = [];
  public enemyObjects: Enemy[] = [];

  public copy(level: Level): void {
    this.bridge = level.bridge;
    this.objects = [...level.objects];
    this.staticObjects = [...level.staticObjects];
    this.fuelBarrels = [...level.fuelBarrels];
    this.enemyObjects = [...level.enemyObjects];
  }
}