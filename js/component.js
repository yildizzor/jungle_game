class Component {
  constructor(gameScreen, bottom, width, height, imgSrc) {
    this.gameScreen = gameScreen;
    this.bottom = bottom;
    this.width = width;
    this.height = height;
    this.element = document.createElement("img");
    this.element.src = imgSrc;
    this.element.style.position = "absolute";
    this.element.style.bottom = `${this.bottom}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.gameScreen.appendChild(this.element);
  }

}
