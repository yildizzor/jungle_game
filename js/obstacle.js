class Obstacle extends Component {
  constructor(gameScreen, height, left, groundLevel, gravity, speed) {
    super(gameScreen, height, 60, 60, left);
    this.createImgElement("./images/obstacle.png");

    this.groundLevel = groundLevel;
    this.gravity = gravity;
    this.velocity = 0;
    this.distance = 0;

    this.speed = speed;
  }

  move() {
    this.left -= this.speed;
    this.distance += this.speed;

    if (this.bottom > this.groundLevel) {
      this.velocity += this.gravity;
      this.bottom -= this.velocity;
    } else {
      this.velocity = 0;
      this.bottom = this.groundLevel;
    }

    this.updatePosition();
  }

  getDistance() {
    return this.distance;
  }
}
