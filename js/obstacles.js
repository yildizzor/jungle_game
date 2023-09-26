class Component {
  constructor() {
    this.gainHealth = false;
    this.needsSplashAnimation = false;
    this.points = 10;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 60;
    this.frameTimer = 0;
    this.markedForDeletion = false;
    this.audio;
  }

  frameInterval() {
    return 1000 / this.fps;
  }

  play() {
    if (this.audio) {
      this.audio.play();
    }
  }
  update(deltaTime) {
    if (this.game.isPaused()) {
      return;
    }
    // movement
    this.x -= this.speedX + this.game.speed; // TODO: this.game.speed should multiply with speedModifier like as Background images to stay
    const vy = this.speedY + this.game.gravity;

    if (this.y < this.maxY) this.y += vy;
    if (this.frameTimer > this.frameInterval()) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    // check if off screen
    if (this.x + this.width < 0) this.markedForDeletion = true;
  }

  draw(context) {
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
}

class FlyingObstacle extends Component {
  constructor(game) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 44;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = 2;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("splash");
    this.angle = 0;
    this.va = Math.random() * 0.1 + 0.1;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
  }
}

class ClimbingObstacle extends Component {
  constructor(game) {
    super();
    this.game = game;
    this.width = 120;
    this.height = 144;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.5;
    this.image = document.getElementById("splash");
    this.speedX = 0;
    this.speedY = Math.random() > 0.5 ? 1 : -1;
    this.maxFrame = 5;
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.y > this.game.height - this.height - this.game.groundMargin)
      this.speedY *= -1;
    if (this.y < -this.height) this.markedForDeletion = true;
  }

  draw(context) {
    super.draw(context);
    context.beginPath();
    context.moveTo(this.x + this.width / 2, 0);
    context.lineTo(this.x + this.width / 2, this.y + 50);
    context.stroke();
  }
}

class MonkeyObstacle extends Component {
  constructor(game) {
    super();
    this.game = game;
    this.width = 120;
    this.height = 151;
    this.x = this.game.width;
    //this.y = this.randomNumber(100, 120);
    this.y = 300;
    this.image = document.getElementById("monkey");
    this.audio = document.getElementById("monkey-sound");
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 0;
  }
}

class ShitObstacle extends Component {
  constructor(game) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 60;
    this.x = this.game.width;
    this.y = 0;
    this.maxY = this.game.height - this.height - this.game.groundMargin;
    this.image = document.getElementById("shit");
    this.speedX = 0;
    this.speedY = 10;
    this.maxFrame = 0;
    this.needsSplashAnimation = true
  }
}

class Splash extends Component {
  constructor(game) {
    super();
    this.game = game;
    this.image = document.getElementById("splash");
    this.audio = document.getElementById("splash-audio");
    this.width = 100;
    this.height = 100;
    this.x = this.game.player.x + this.game.player.width * 0.45;
    this.y = this.game.player.y - this.height * 0.2;
    this.play();
  }

  update(deltaTime) {
    if (!this.game.isPaused()) this.markedForDeletion = true;
  }
}

class Apple extends Component {
  constructor(game) {
    super();
    this.game = game;
    this.width = 80;
    this.height = 90;
    this.x = this.game.width;
    this.y = this.randomNumber(100, 120);
    this.image = document.getElementById("apple-warm");
    this.audio = document.getElementById("fruit-sound");
    this.speedX = 0;
    this.speedY = 0;
    this.fps = 8;
    this.maxFrame = 7;
    this.gainHealth = true;
    this.points = 20;
  }
}

class Banana extends Component {
  constructor(game) {
    super();
    this.game = game;
    this.width = 76;
    this.height = 110;
    this.x = this.game.width;
    this.y = this.randomNumber(70, 130);
    this.image = document.getElementById("banana");
    this.audio = document.getElementById("fruit-sound");
    this.speedX = 0;
    this.speedY = 0;
    this.fps = 4;
    this.maxFrame = 1;
    this.gainHealth = true;
    this.points = 20;
  }
}
