class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameEndScreen = document.querySelector("#game-end-screen");

    this.gameMinWidth = 1400;
    this.gameMinHeight = 700;
    this.gameScreen.style.minWidth = `${this.gameMinWidth}px`;
    this.gameScreen.style.minHeight = `${this.gameMinHeight}px`;

    // This is adjustment for speed according to different screen resolutions
    if (window.innerWidth < 1500) {
      this.bgAnimationDuration = 450;
      this.gravity = 0.24;
      this.obstacleSpeed = 3.7;
    } else {
      this.bgAnimationDuration = 300;
      this.gravity = 0.18;
      this.obstacleSpeed = 2.8;
    }

    this.gameScreen.style.animation = `slide ${this.bgAnimationDuration}s linear infinite`;

    // Define ground level and initial rider positions
    this.groundLevel = 150;

    // Instantiate a rider and make it visible on the screen
    this.rider = new Rider(
      this.gameScreen,
      this.groundLevel,
      250,
      250,
      50,
      this.gravity
    );

    this.obstacles = [];

    // Scoreboard and stats related properties
    this.score = 0;
    this.lives = 3;
    this.timer = 120;

    this.gameIsOver = false; // To verify game is over or not
    this.gamePaused = false; // When a clash happens, we have to pause
  }

  start() {
    this.startScreen.style.display = "none";
    this.gameEndScreen.style.display = "none";
    this.gameScreen.style.display = "block";

    this.gameLoop();
    this.startTimer();
  }

  gameLoop() {
    // console.log("in the game loop");

    if (this.isGameOver()) {
      this.endGame();
      return true;
    }

    this.update();

    window.requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    if (this.gamePaused) {
      return;
    }

    this.rider.move();

    let i = 0;
    while (i < this.obstacles.length) {
      const obs = this.obstacles[i];

      obs.move();

      if (this.rider.didCollide(obs) === true) {
        const splashBottom = this.rider.bottom + 0.58 * this.rider.height;
        const splashLeft = this.rider.left + 0.45 * this.rider.width;

        const splash = new Splash(this.gameScreen, splashBottom, splashLeft);

        this.pauseGame(); // Freezing game screen but timer is continue
        splash.play();

        obs.element.remove();
        this.obstacles.splice(i, 1);

        this.lives -= 1;

        i--;
      } else if (obs.left <= 0) {
        this.score += 10;

        obs.element.remove();
        this.obstacles.splice(i, 1);

        i--;
      }

      i++;
    }

    // Update scoreboard
    document.getElementById("score").innerHTML = this.score;
    document.getElementById("lives").innerHTML = this.lives;

    const obsLen = this.obstacles.length;
    const noObstacleLeft = obsLen === 0;
    const lastObstacleDistEnough =
      obsLen >= 1 && this.obstacles[obsLen - 1].getDistance() > 450;

    if (Math.random() > 0.98 && (noObstacleLeft || lastObstacleDistEnough)) {
      const obstacle = new Obstacle(
        this.gameScreen,
        this.getGameHeight(),
        this.getGameWidth(),
        this.groundLevel,
        this.gravity,
        this.obstacleSpeed
      );

      this.obstacles.push(obstacle);
    }
  }

  pauseGame() {
    this.gamePaused = true;
    this.rider.setAnimationDuration(0);

    // Get background position before stopping animation. Otherwise, background is moving to 0-0 position
    const currentBgPos = this.getCurrentBgXPos();
    this.setGameScreenAnimeDuration(0); // Stop animation by 0s animation
    this.setBgPositionX(currentBgPos);

    setTimeout(() => {
      this.rider.setJumping(false); // to make rider starts riding on ground, skipping jumping event.
      this.rider.resetAnimationDuration();
      this.rider.resetPosition();

      this.setGameScreenAnimeDuration(this.bgAnimationDuration);

      this.gamePaused = false;
    }, 2000);
  }

  startTimer() {
    setInterval(() => {
      if (this.timer >= 0) {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer - minutes * 60;

        const dispMin = String(minutes).padStart(2, "0");
        const dispSec = String(seconds).padStart(2, "0");

        document.getElementById("minutes").innerHTML = dispMin;
        document.getElementById("seconds").innerHTML = dispSec;

        this.timer--;
      }
    }, 1000);
  }

  setGameScreenAnimeDuration(duration) {
    this.gameScreen.style.animationDuration = `${duration}s`;
  }

  getCurrentBgXPos() {
    const calculated = window.getComputedStyle(this.gameScreen);
    return calculated.getPropertyValue("background-position-x");
  }

  setBgPositionX(currentBgPos) {
    this.gameScreen.style.backgroundPositionX = currentBgPos;
  }

  getGameWidth() {
    if (this.gameMinWidth > window.innerWidth) {
      return this.gameMinWidth;
    }
    return window.innerWidth;
  }

  getGameHeight() {
    if (this.gameMinHeight > window.innerHeight) {
      return this.gameMinHeight;
    }
    return window.innerHeight;
  }

  isGameOver() {
    return this.lives === 0 || this.timer < 0;
  }

  endGame() {
    if (this.lives > 0) {
      document.getElementById("game-result").innerHTML = "You Win!!!";
    }
    document.getElementById("final-score").innerHTML = this.score;
    document.getElementById("remaining-lives").innerHTML = this.lives;

    // If game paused, it means that there is collision, so wait for animation ends
    let timeout = 50;
    if (this.gamePaused) {
      timeout = 1500;
    }

    setTimeout(() => {
      this.rider.element.remove();
      this.obstacles.forEach((obstacle) => obstacle.element.remove());

      this.gameScreen.style.display = "none";
      this.gameEndScreen.style.display = "flex";
    }, timeout);
  }
}
