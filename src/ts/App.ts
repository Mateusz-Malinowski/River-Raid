import Canvas from "./core/Canvas";
import Renderer from "./core/Renderer";
import Scene from "./core/Scene";
import Game from "./Game";

export default class App {
  private game: Game;
  private gameScene: Scene;
  private gameRenderer: Renderer;

  public constructor() {
    Canvas.create(1024, 1024);
    this.gameScene = new Scene();
    this.game = new Game(this.gameScene);
    this.gameRenderer = new Renderer(this.gameScene, this.game.render);
    this.gameRenderer.startRendering();
  }
}