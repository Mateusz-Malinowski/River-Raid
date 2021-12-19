import Assets from "./core/Assets";
import Camera from "./core/Camera";
import Canvas from "./core/Canvas";
import Keyboard from "./core/Keyboard";
import Renderer from "./core/Renderer";
import Scene from "./core/Scene";
import Game from "./Game";
import LevelGenerator from "./LevelGenerator";

export default class App {
  private game: Game;
  private gameCamera: Camera;
  private gameScene: Scene;
  private gameRenderer: Renderer;
  private canvasWidth: number = 2000;
  private canvasHeight: number = 1500;

  public constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    await Assets.loadImages();
    Keyboard.create();
    
    Canvas.create(this.canvasWidth, this.canvasHeight);
    LevelGenerator.init();
    this.gameCamera = new Camera();
    this.gameScene = new Scene(this.gameCamera);
    this.game = new Game(this.gameScene);
    this.gameRenderer = new Renderer(this.gameScene, this.game.beforeDrawing, this.game.afterDrawing);
    this.gameRenderer.startRendering();
  }
}