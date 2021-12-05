import Assets from "./core/Assets";
import Canvas from "./core/Canvas";
import Renderer from "./core/Renderer";
import Scene from "./core/Scene";
import Game from "./Game";

export default class App {
  private game: Game;
  private gameScene: Scene;
  private gameRenderer: Renderer;
  private canvasWidth: number = 2000;
  private canvasHeight: number = 1500;

  public constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    await Assets.loadImages();
    
    Canvas.create(this.canvasWidth, this.canvasHeight);
    this.gameScene = new Scene();
    this.game = new Game(this.gameScene);
    this.gameRenderer = new Renderer(this.gameScene, this.game.render);
    this.gameRenderer.startRendering();
  }
}