class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameEndScreen = document.querySelector("#game-end-screen");
    this.rider = new Rider(
      this.gameScreen,
      30,
      100,
      250,
      200,
      "./images/rider5.png"
    );
    this.height = 600;
    this.width = 500;
    this.obstacles = [];
    this.score = 0;
    this.health = 100;
    this.gameIsOver = false;
  }

  start() {
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";

    this.gameLoop();
  }

  gameLoop() {
    // console.log("in the game loop");

    if (this.gameIsOver) {
      return true;
    }

    this.update();

    window.requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    let i = 0;
    while (i < this.obstacles.length) {
      let obs = this.obstacles[i];

      obs.move();

      //   if (this.rider.didCollide(obs) === true) {
      //     obs.element.remove();
      //     this.obstacles.splice(i, 1);

      //     this.health -= 10;

      //     i--;
      //   } else
      if (obs.right > this.width) {
        this.score += 1;
        obs.element.remove();
        this.obstacles.splice(i, 1);
        i--;
      }

      i++;
    }

    if (Math.random() > 0.98 && this.obstacles.length < 5) {
      this.obstacles.push(new Obstacle(this.gameScreen));
    }
  }
}
