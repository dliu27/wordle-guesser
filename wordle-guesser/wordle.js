window.onload = () => {
  const hash = window.wordle.hash;

  fetch("https://www.nytimes.com/games/wordle/main.4951a4aa.js")
    .then((x) => x.text())
    .then((y) => {
      let wordArray = y
        .slice(
          y.indexOf('customElements.define("game-toast",'),
          y.indexOf("unknown: 0")
        )
        .substring(14)
        .replace("var Ma=", "")
        .replace("[", "")
        .replace("]", "")
        .replace(/"/g, "")
        .split(",");
      console.log(wordArray);
    });

  var game = document.querySelector("game-app");
  var solution = game.solution;
  console.log(solution);
  if (game) {
    let title = game.shadowRoot.querySelector(".title");
    if (title) {
      title.innerHTML = "Wordle #" + game.dayOffset;
    }
    console.log(game.dayOffset);
  }
  console.log(game);
  var temp = document.body.getElementsByTagName("game-app");
  console.log(temp);
  var startDate = new Date(2021, 5, 19, 0, 0, 0, 0);
  var endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  var offset = Math.round((endDate.getTime() - startDate.getTime()) / 864e5);
};
