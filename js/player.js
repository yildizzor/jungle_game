class Player {
  constructor(game) {
    this.game = game;
    this.width = 250;
    this.height = 250;
    this.x = 100; // player's initial x position
    this.y = this.game.height - this.height - this.game.groundMargin; // player's initial y level
    this.yOffset = 0; // for bending image to draw it on ground
    this.vy = 0; // velocity on y axis for jumping and falling
    this.image = document.getElementById("player");
    this.tempImage = document.getElementById("player-bending"); // For bending position, "player-bending" will replaced "player" image
    this.frameX = 0;
    this.maxFrame = 16; // image consists of 17 frames of sprite sheet
    this.fps = 60;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;

    this.states = [
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Hitting(this.game),
      new Bending(this.game),
    ];

    this.currentState = null;
  }

  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);

    // vertical movement
    this.y += this.vy;
    if (!this.onGround()) {
      if (!this.currentState.isGamePaused()) {
        this.vy += this.game.gravity;
      }
    } else {
      this.vy = 0;
    }

    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      // Frame timer should restart
      this.frameTimer = 0;

      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      // Frame timer is continue
      this.frameTimer += deltaTime;
    }
  }

  draw(context) {
    // yOffset is for the bending state, to draw bike more lower position
    if (this.game.debug) {
      context.strokeRect(
        this.x,
        this.y + this.yOffset,
        this.width,
        this.height - this.yOffset
      );
    }
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0 * this.height,
      this.width,
      this.height - this.yOffset,
      this.x,
      this.y + this.yOffset,
      this.width,
      this.height - this.yOffset
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state, speed) {
    this.currentState.cleanUp();
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollision() {
    const xOffset = 30;
    // colision detected
    this.game.obstacles.forEach((obs) => {
      if (
        obs.x < this.x + this.width - obs.xForwardOffset &&
        obs.x + obs.width > this.x + obs.xBackwardOffset &&
        obs.y < this.y + this.yOffset + this.height - obs.yUpOffset &&
        obs.y + obs.height > this.y + this.yOffset + obs.yUpOffset
      ) {
        if (!obs.markedForDeletion) {
          obs.play();
        }

        obs.markedForDeletion = true;

        if (obs.gainHealth) {
          this.game.score += obs.points;
        } else {
          this.setState(3, 0); // Hitting state
          if (obs.needsSplashAnimation) {
            this.game.splash.push(new Splash(this.game));
          }
          this.game.lives -= 1;
        }
      } else if (obs.x < 0) {
        obs.markedForDeletion = true;
        if (!obs.gainHealth) {
          this.game.score += obs.points;
        }
      }
    });
  }

  isBendingState() {
    return this.currentState.state === "BENDING";
  }
}
