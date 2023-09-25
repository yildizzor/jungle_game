class Layer {
  constructor(game, width, height, speedModifier, image) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }

  update() {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speedModifier;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

class Background {
  constructor(game) {
    this.game = game;
    this.width = this.game.width;
    this.height = this.game.height;

    this.audio = document.getElementById("background-sound");
    this.audio.volume = 0.3;

    this.layer1Img = document.getElementById("layer");
    this.layer1 = new Layer(
      this.game,
      this.width,
      this.height,
      1,
      this.layer1Img
    );

    this.backgroundLayers = [this.layer1];
  }

  update() {
    this.backgroundLayers.forEach((layer) => {
      layer.update();
    });
  }

  draw(context) {
    this.backgroundLayers.forEach((layer) => {
      layer.draw(context);
    });
  }
}
