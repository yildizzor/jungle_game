class Player {
  constructor(game) {
    this.game = game;
    this.width = 250;
    this.height = 250;
    this.x = 100; // player's initial x level
    this.y = this.game.height - this.height - this.game.groundMargin; // player's initial y level
    this.vy = 0;
    this.image = document.getElementById("player");
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 16; // image consists of 17 frames of sprite sheet
    this.fps = 60;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;

    this.states = [
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Hitting(this.game),
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
      this.frameTimer = 0;

      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollision() {
    const xOffset = 30;
    // colision detected
    this.game.obstacles.forEach((obs) => {
      if (
        obs.x < this.x + this.width - xOffset &&
        obs.x + obs.width > this.x + xOffset &&
        obs.y < this.y + this.height &&
        obs.y + obs.height > this.y
      ) {
        if (!obs.markedForDeletion) {
          obs.play()
        }

        obs.markedForDeletion = true;

        if (obs.gainHealth) {
          this.game.score += obs.points;
        } else {
          this.setState(3, 0); // Hitting state
          this.game.splash.push(new Splash(this.game));
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
}
