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

    // Collision detection adjustments because bicycle rider image is not exact rectangle
    this.forwardOffset = 0;
    this.backwardOffset = 0;
    this.upOffset = 0;
    this.downOffset = 0;
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
    // colision detected
    this.game.obstacles.forEach((obs) => {
      this.adjustOffsets(obs);

      const playerY = this.y + this.yOffset;
      const yPosDelta = this.upOffset - this.downOffset;

      const playerForwardXPos = this.x + this.width - this.forwardOffset;
      const playerBackwardXPos = this.x + this.backwardOffset;
      const playerUpYPos = playerY + this.height - yPosDelta;
      const playerDownYPos = playerY + yPosDelta;

      if (
        obs.x < playerForwardXPos &&
        obs.x + obs.width > playerBackwardXPos &&
        obs.y < playerUpYPos &&
        obs.y + obs.height > playerDownYPos
      ) {
        // Collision detected
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

  adjustOffsets(obs) {
    // The following properties is used to adjust collision detection
    this.forwardOffset = 0;
    this.backwardOffset = 0;
    this.upOffset = 0;
    this.downOffset = 0;

    // up level of x and y position offsets
    const xUpForwardOffset = 75;
    const xUpBackwardOffset = 100;
    const yUpOffset = 90;

    // down level x and y position offsets
    const xDownForwardOffset = 20;
    const xDownBackwardOffset = 35;
    const yDownOffset = 30;

    // Check relative position difference between player and obstacle
    const xForwardPosResult = this.x + this.width - obs.x;
    const xBackwardPosResult = obs.x + obs.width - this.x;
    const yUpwardPosResult = obs.y + obs.height - this.y;
    const yDownwardPosResult = this.y + this.height - (obs.y + obs.height);

    if (yUpwardPosResult < yUpOffset) {
      // Calculate upper position offset adjustments
      if (xForwardPosResult < xUpForwardOffset) {
        this.forwardOffset = xUpForwardOffset;
      } else if (xBackwardPosResult < xUpBackwardOffset) {
        this.backwardOffset = xUpBackwardOffset;
      }

      if (
        (this.forwardOffset > 0 || this.backwardOffset > 0) &&
        yUpOffset > yUpwardPosResult
      ) {
        this.upOffset = yUpOffset;
      }
    } else if (yDownwardPosResult < yDownOffset) {
      // Calculate lower position offset adjustments
      if (xForwardPosResult < xDownForwardOffset) {
        this.forwardOffset = xDownForwardOffset;
      } else if (xBackwardPosResult < xDownBackwardOffset) {
        this.backwardOffset = xDownBackwardOffset;
      }

      if (
        (this.forwardOffset > 0 || this.backwardOffset > 0) &&
        yDownOffset > yDownwardPosResult
      ) {
        this.downOffset = yDownOffset;
      }
    }
  }

  isBendingState() {
    return this.currentState.state === "BENDING";
  }
}
