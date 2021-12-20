import CanvasGroup from "./core/CanvasGroup";
import CanvasObject from "./core/CanvasObject";
import { Enemy } from "./enemies/Enemy";
import Tank from "./enemies/Tank";
import LevelBridge from "./LevelBridge";
import LevelFuel from "./LevelFuel";
import ImageObject from "./objects/ImageObject";

export default class Level extends CanvasGroup {
  public bridge: LevelBridge = null;
  public tank: Tank = null;
  public staticObjects: CanvasObject[] = [];
  public fuelBarrels: LevelFuel[] = [];
  public enemyObjects: Enemy[] = [];

  public copy(level: Level): void {
    this.bridge = level.bridge;
    this.tank = level.tank;
    this.objects = [...level.objects];
    this.staticObjects = [...level.staticObjects];
    this.fuelBarrels = [...level.fuelBarrels];
    this.enemyObjects = [...level.enemyObjects];
  }
}