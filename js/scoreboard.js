class ScoreBoard {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = '"Comic Sans MS", "Comic Sans", cursive';
    this.livesIcon = document.getElementById("fietser-icon");
  }

  draw(context) {
    //  Save canvas context because the context settings, like shadow effect and others,
    //  changed in this method only applied the drawings done in this method
    //  If this is not used, other drawings, like player, obstacles, will have shadows... 
    context.save();

    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.textAlign = "left";
    context.fillStyle = "white";

    this.setCtxShadowEffect(context);
    // scoreboard
    context.fillText("Score: " + this.game.score, 20, 50);
    this.setCtxFont(context, 0.8);
    context.fillText(`Time: ${this.getTime()}`, 20, 80);
    let offset = 0;
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesIcon, 0, 0, 35, 35, (20 + offset), 95, 35, 35);
      offset += 35;
    }

    // game over
    if (this.game.gameOver) {
      context.textAlign = "center";
      this.setCtxFont(context, 2); // Do font size double

      const centerLocationX = this.game.width * 0.5; // canvas width center
      const centerLocationY = this.game.height * 0.5; // canvas height center

      if (this.game.hasWinner()) {
        context.fillStyle = "#ff0066";
        context.fillText("You Win!!!", centerLocationX, centerLocationY - 200); // Above of Restart  button
      } else {
        context.fillStyle = "red";
        context.fillText("Game Over!", centerLocationX, centerLocationY - 200); // Above of Restart  button
      }

      const livesCount = this.game.lives > 0 ? this.game.lives : "no";
      const scoreText = `Your score is ${this.game.score}!`;
      const livesText = `You have ${livesCount} lives left!`;

      this.setCtxFont(context, 1);
      context.fillText(scoreText, centerLocationX, centerLocationY - 150);
      context.fillText(livesText, centerLocationX, centerLocationY - 100);
    }

    // Restore canvas context settings saved as first line of this method
    // If this is not used, other drawings, like player, obstacles, will have shadows...
    context.restore();
  }

  setCtxShadowEffect(context) {
    // Shadow effect for the canvas drawings
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "black";
    context.shadowBlur = 4;
  }

  setCtxFont(context, fontSizeFactor) {
    const fontSize = this.fontSize * fontSizeFactor;
    context.font = `${fontSize}px ${this.fontFamily}`;
  }

  getTime() {
    // Get remaining time and convert it from milliseconds to seconds
    let timeLeft = (this.game.gameDuration - this.game.currentTime) / 1000;
    timeLeft = timeLeft >= 0 ? timeLeft : 0;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft - minutes * 60);

    const dispMin = String(minutes).padStart(2, "0");
    const dispSec = String(seconds).padStart(2, "0");

    return `${dispMin}:${dispSec}`;
  }
}
