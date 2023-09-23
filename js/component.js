class Component {
  constructor(gameScreen, bottom, width, height, left) {
    this.gameScreen = gameScreen;
    this.bottom = bottom;
    this.width = width;
    this.height = height;
    this.left = left;
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.bottom = `${this.bottom}px`;
  }

  createElement(elementTag) {
    this.element = document.createElement(elementTag);
    this.element.style.position = "absolute";
    this.element.style.bottom = `${this.bottom}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.left}px`;
    this.gameScreen.appendChild(this.element);
  }

  createImgElement(imgSrc) {
    this.createElement("img");
    this.element.src = imgSrc;
  }

  createDivElement(id, bgImg) {
    this.createElement("div");
    this.element.id = id;
    if (bgImg !== undefined) {
      this.element.style.background = `url('${bgImg}') left center`;
    }
  }
}
