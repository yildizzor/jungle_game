window.onload = () => {
  const startButton = document.getElementById("start-button");

  let game;

  startButton.addEventListener("click", () => {
    startGame();
  });

  function startGame() {
    console.log("GAME STARTED");

    game = new Game();

    game.start();
  }
};
