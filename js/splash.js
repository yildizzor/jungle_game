class Splash extends Component {
  constructor(gameScreen, bottomOffset, leftOffset) {
    super(gameScreen, bottomOffset, 100, 180, leftOffset);
    this.createImgElement("./images/splash.png");

    this.audio = new Audio("./audio/shit.mp3");
  }

  remove() {
    setTimeout(() => {
      this.element.remove();
    }, 2000);
  }

  audioPlay() {
    this.audio.play();
  }

  play() {
    this.audioPlay();
    this.remove();
  }
}
