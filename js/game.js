class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.groundMargin = 120;
    this.speed = 6;
    this.maxSpeed = 6;
    this.gravity = 1;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.scoreBoard = new ScoreBoard(this);
    this.obstacles = [];
    this.splash = [];
    this.obstacleTimer = 0;
    this.obstacleInterval = 1500;
    this.debug = false;
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.currentTime = 0;
    this.deltaTime = 0; // time elapsed in between each animation frame
    this.maxTime = 122 * 1000; // 122 seconds

    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
  }

  update(deltaTime) {
    this.currentTime += deltaTime;
    if (this.currentTime > this.maxTime || this.lives < 1) this.gameOver = true;
    this.background.update();
    this.player.update(this.input, deltaTime);

    //Handle Obstacles
    if (this.obstacleTimer > this.obstacleInterval) {
      this.obstacleTimer = 0;
      this.addObstacle();
    } else {
      this.obstacleTimer += deltaTime;
    }

    this.obstacles.forEach((obs) => obs.update(deltaTime));
    this.obstacles = this.obstacles.filter((obs) => !obs.markedForDeletion);
    this.splash.forEach((splash) => splash.update(deltaTime));
    this.splash = this.splash.filter((splash) => !splash.markedForDeletion);
  }

  draw(context) {
    this.background.draw(context);
    this.player.draw(context);
    this.obstacles.forEach((obs) => obs.draw(context));
    this.splash.forEach((splash) => splash.draw(context));
    this.scoreBoard.draw(context);
  }

  addObstacle() {
    if (this.speed <= 0) {
      return;
    }

    if (Math.random() > 0.8) {
      this.obstacles.push(new ShitObstacle(this));
    } else if (Math.random() > 0.6) {
      this.obstacles.push(new MonkeyObstacle(this));
    } else

    if ( Math.random() > 0.5) {
      this.obstacles.push(new Apple(this));
    } else if (Math.random() > 0.5) {
      this.obstacles.push(new Banana(this));
    }
  }

  start(context) {
    context.canvas.style.display = "block";
    this.background.audio.play();
  }

  isPaused() {
    return this.player.currentState.isGamePaused();
  }

  hasWinner() {
    return this.lives > 0;
  }

  end() {
    this.background.audio.pause();

    if (this.hasWinner()) {
      document.getElementById("game-win-sound").play();
    } else {
      document.getElementById("game-over-sound").play();
    }

    document.getElementById("game-end-screen").style.display = "flex";
  }
}
