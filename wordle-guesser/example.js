
 
 
 
var shouldUse = prompt("Would you like the bot to play wordle for you? (true / false)").trim()
var totalNumOfTries = localStorage.getItem("numberTrials") ? parseInt(localStorage.getItem("numberTrials")) : 1 
var shouldShowModal = localStorage.getItem("showModal") ? parseInt(localStorage.getItem("showModal")) == 1 : true 
var overrideSolution = localStorage.getItem("overrideSolution") ? localStorage.getItem("overrideSolution") : '' 
 
let gameApp = document.querySelector("game-app")
let gameThemeManager = gameApp.shadowRoot.children[1]
let game = gameThemeManager.children[1]
let gameModal = game.children[3]
 
if (shouldShowModal) {
    gameModal.remove()
}
if (overrideSolution.length == 5) {
    gameApp.solution = overrideSolution;
}
 
if ( shouldUse != "true" ){
    console.log("Good luck next time!");
} else { //hype keep going 
 
(function () {
    'use strict';
 
  
  
  function typeAndEnter(word){
     
  
      for (let i = 0; i < 5; i++) {
          window.dispatchEvent(new KeyboardEvent('keydown', {
            'key': word[i]
          }));
      }
      window.dispatchEvent(new KeyboardEvent('keydown', {
          'key': 'Enter'
      }));
  
     
  }
  
  function getNumGuesses(){
  
      var numGuesses = 0;  
     
      var boardState = document.querySelectorAll("game-app")[0].boardState
      for (let i = 0; i < boardState.length; i++) {
          if (boardState[i].length != 0) {
              numGuesses += 1;
          }
      }
      return numGuesses;
  }
  
  function getCorrectAndIncorrectLetters(numGuesses){
  
      var not_in_word = [];
      var not_in_right_place = [[],[],[],[],[]];
      var in_right_place = ['', '', '', '', ''];
     
      // STEP 1: Keep track of letters in right and in word but in wrong places 
      var boardState = document.querySelectorAll("game-app")[0].boardState
      var evaluations = document.querySelectorAll("game-app")[0].evaluations
      for (let i = 0; i < numGuesses; i++) {
          let currEval = evaluations[i];
          for (let j =0; j < currEval.length; j++) {
              if (evaluations[i][j] == "correct") {
                  in_right_place[j] = boardState[i][j];
              } else if (evaluations[i][j] == "present") {
                  not_in_right_place[j].push(boardState[i][j])
              } 
          }
      }
 
      // STEP 2: Look at absent letters 
      for (let i = 0; i < numGuesses; i++) {
        let currEval = evaluations[i];
        for (let j =0; j < currEval.length; j++) {
            if (evaluations[i][j] == "absent") {
                var letter_not_in_not_in_right_place = true;  
                for (let k = 0; k < 5; k++) { // only push if it's not already in and not in and not in another place
                    if (not_in_right_place[k].includes(boardState[i][j])) {
                      letter_not_in_not_in_right_place = false; 
                    }
                }
                if (in_right_place.includes(boardState[i][j])) {
                    letter_not_in_not_in_right_place = false; 
                }
                if (letter_not_in_not_in_right_place && !not_in_word.includes(boardState[i][j])) {
                  not_in_word.push(boardState[i][j])
                }
 
 
            }
        }
    }
  
      return [not_in_word, not_in_right_place, in_right_place];
  }
  
  
  function createLetterMaps(allWords) {
      var l1 = {};
      var l2 = {};
      var l3 = {};
      var l4 = {};
      var l5 = {};
      var allDictionaries = [l1, l2, l3, l4, l5]
  
      for (let i = 0; i < allWords.length; i++) {
          var word = allWords[i]
          for (let j = 0; j < 5; j++) {
              var letter = allWords[i][j]
              if (!allDictionaries[j][letter]) {
                  allDictionaries[j][letter] = [word];
              } else {
                  allDictionaries[j][letter].push(word);            
              }
          }
      }
  
      return allDictionaries
  }
 
 
 
function getPossibleWords(words, letters_not_in_word, letters_in_wrong_places, letters_in_right_places, curr_guess) {
    var ret = [] 
 
    for (let i = 0; i < words.length; i++){
        var word = words[i]
 
        if (word == "") {
            continue 
        }
 
        // STEP 1: Remove All Words CONTAINING LETTERS NOT IN THE WORD
        var letter_not_in_word = true 
        for (let j = 0; j < letters_not_in_word.length; j++){
            var letter = letters_not_in_word[j]
            if (letter == ""){
                continue 
            }
            if (word.includes(letter)) {
                letter_not_in_word = false;
            }
        }
 
        // STEP 2: Remove All Words With Letters in Incorect Places 
        var letter_not_in_wrong_place = true 
        for (let k = 0; k < letters_in_wrong_places.length; k++){
            var letters = letters_in_wrong_places[k]
            for (let kk = 0; kk < letters.length; kk++){
                var letter = letters[kk]
                if (word[k] == letter) {
                    letter_not_in_wrong_place = false; 
                }
                if (!word.includes(letter)) { // remove word if it does not have this letter at all 
                    letter_not_in_wrong_place = false; 
                } 
            }
        }
 
        // STEP 3: Only keep words with letters in the right place 
        var letter_in_right_place = true 
        for (let l = 0; l < letters_in_right_places.length; l++){
            var letters = letters_in_right_places[l];
            for (let ll =0; ll < letters.length ; ll++) {
                var letter = letters[ll]
                if (letter == ""){
                    continue 
                }
                if (word[l] != letter) {
                    letter_in_right_place = false;
                }
            }
        }
 
        var guess_is_not_curr_guess = true
        if (curr_guess == word){
            console.log("Removing last guessed word")
            guess_is_not_curr_guess = false
        }
 
 
        if (letter_not_in_word && letter_not_in_wrong_place && letter_in_right_place && guess_is_not_curr_guess){
            ret.push(word)
        }
 
    } 
 
    return ret  
 
}
 
const sleep = ms => new Promise(r => setTimeout(r, ms));
 
 
async function solveProblem(){
    var freshRun = true; 
    var letters_in_right_place = ['', '', '', '', '']
    for (let guess = getNumGuesses(); guess <= 6; guess++) {
 
 
        // STEP 1: Guess a word
        var word_guess = words[Math.floor(Math.random() * words.length)]
 
        // STEP 1.1 smarter guess
        var all_letters_map = createLetterMaps(words)
        var curr_max = 0; 
        for (let i =0; i < letters_in_right_place.length; i++) {
            if (letters_in_right_place[i] != ""){
                var curr_dict = all_letters_map[i];
                for (var [key, value] of Object.entries(curr_dict)) {
                    if (value.length > curr_max) { 
                        word_guess = value[Math.floor(Math.random() * value.length)]
                    }
                  }
            }
        }
 
        console.log(all_letters_map)
        if (guess == 0) {
            word_guess = "crane"
        } 
 
 
        console.log("-------------------------------------------------------------")
 
        if (guess > 0 && freshRun) {
            console.log("*** Rerunning userscript despite game being in progress"); 
        } else {
            typeAndEnter(word_guess)
            await sleep(2000);
            console.log("Size of list before guess no. " + guess + ": " + words.length)
            console.log("Entering word '" + word_guess + "' for try no. ", + guess)
        }
        freshRun = false; 
 
       
        // STEP 2: Get feedback from guessing
        var feedback = getCorrectAndIncorrectLetters(getNumGuesses())
        var letters_not_in = feedback[0]
        var letters_in_wrong_place = feedback[1]
        letters_in_right_place = feedback[2]
 
        console.log("Letters not in word: " + letters_not_in)
        console.log("Letters in wrong place: 0:" + letters_in_wrong_place[0] + " 1:" + letters_in_wrong_place[1] + " 2:" + letters_in_wrong_place[2] + " 3:" + letters_in_wrong_place[3] + " 4:" + letters_in_wrong_place[4] )
        console.log("Letters in right place: " + letters_in_right_place)
 
        // STEP 3: Remove words from words list that no longer fit standards
        // words = removeLettersNotInWord(words, letters_not_in)
        // words = removeWordsWithLettersInWrongPlaces(words, letters_in_wrong_place)
        // words = removeWordsWithLettersNotInRightPlaces(words, letters_in_right_place)
        words = getPossibleWords(words, letters_not_in, letters_in_wrong_place, letters_in_right_place, word_guess)
 
        console.log("Size of list after guess no. " + guess + ": " + words.length)
        if (words.length < 50) {
            console.log(words)
        }
 
        console.log("-------------------------------------------------------------")
 
 
        if (JSON.parse(localStorage.getItem("nyt-wordle-state")).gameStatus == "WIN" && JSON.parse(localStorage.getItem("nyt-wordle-statistics")).gamesPlayed < totalNumOfTries) {
 
            console.log("TRYING TO DELETE CACHE AND RELOAD")
 
            localStorage.setItem("nyt-wordle-state", '')
            // restart page
            location.reload()
 
    }
 
    }
   
}
 
    
 
if (getNumGuesses() < 6) {
  solveProblem(); 
}
 
 
 
 
 
 
 
    
    
    
})();
}

flappy bird hacks too