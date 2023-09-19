class Obstacle extends Component {
  constructor(gameScreen, right) {
    super(gameScreen, 100, 60, 60, "./images/obstacle.png");

    this.right = 100;
    this.element.style.right = `${this.right}px`;
  }

  updatePosition() {
    this.element.style.right = `${this.right}px`;
  }

  move() {
    this.right += 3;

    this.updatePosition();
  }
}
