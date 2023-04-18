(async function () {
  var hash;
  var answerArray;
  var guessArray;

  const getHash = async () => {
    return fetch("./")
      .then((x) => x.text())
      .then((y) => {
        const reg = /main\..+\.js/g;
        let result = reg.exec(y);
        hash = result[0];
      });
  };

  const getArrays = async () => {
    await getHash();
    return fetch("./" + hash)
      .then((x) => x.text())
      .then((y) => {
        y = y.slice(y.indexOf("var La="), y.indexOf(",Ia="));
        let string_copy = y;
        answerArray = y
          .slice(y.indexOf("var La="), y.indexOf(",Ta="))
          .replace("var La=", "")
          .replace("[", "")
          .replace("]", "")
          .replace(/"/g, "")
          .split(",");
        guessArray = string_copy
          .slice(string_copy.indexOf(",Ta="), string_copy.indexOf(",Ia="))
          .replace(",Ta=", "")
          .replace("[", "")
          .replace("]", "")
          .replace(/"/g, "")
          .split(",");
      });
  };
  await getArrays();
  console.log(answerArray);
  console.log(guessArray);

  console.log(localStorage);
  let wordleState = localStorage.getItem("nyt-wordle-state");

  const solution = wordleState.solution;

  //cheating mode

  if (!wordleState) {
    console.log("nope");
  }
  if (gameStatus === "IN_PROGRESS") {
    console.log("in progress");
  }
  let word = [null, null, null, null, null];
  let chars = [null, null, null, null];
  for (let i = 0; i < rowIndex; i++) {
    for (let j = 0; j < 5; j++) {
      if (wordleState.evaluations[wordleState.rowIndex - 1][j] === "correct") {
        word[j] = wordleState.boardState[wordleState.rowIndex - 1].charAt(j);
      } else if (
        wordleState.evaluations[wordleState.rowIndex - 1][j] === "present"
      ) {
        chars.push(wordleState.boardState[wordleState.rowIndex - 1].charAt(j));
      }
    }
  }
  // (?=a[a-z][a-z][a-z][a-z])(?=e*)
})();
