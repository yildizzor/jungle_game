class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.frontFamily = "Helvetica";
  }

  draw(context) {
    context.font = `${this.fontSize}px ${this.frontFamily}`;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;

    // score
    context.fillText("Score: " + this.game.score, 20, 50);
  }
}
