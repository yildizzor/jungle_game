class Rider extends Component {
  constructor(gameScreen, left, bottom, width, height, imgSrc) {
    super(gameScreen, bottom, width, height, imgSrc);

    this.left = left;
    this.element.style.left = `${this.left}px`;
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
  }
}
