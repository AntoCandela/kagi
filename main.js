// Vengono impostate le due variabili
let wordToType = "";
let wordTyped = "";

// Vengono impostate le due variabili DOM
let wordToTypeDom = document.getElementById("wordToType");
let wordTypedDom = document.getElementById("wordTyped");
let scoreBox = document.getElementById("score-box");
let overlay = document.getElementById("overlay");
let resetButton = document.getElementById('btn-reset');

// Array che identificano quali lettere sono valide e la lista di parole
let legitKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']
let legitWords = [];

let bestScore = 0, activeScore = 0, firstKeyDown = 1, typedEntries = 0;
  
window.addEventListener("load", (e) => {
    // Recuperiamo i dati 
    fetch("words.txt")
        .then((res) => res.text())
        .then((text) => { 
            legitWords = text.replace(/(\r\n|\n|\r)/gm, "").split(',');
            setNewWord();
        })
    .catch((e) => console.error(e));
});

document.addEventListener("keydown", handleFirstKeyDown);

document.addEventListener("keydown", (e) => {
    // Se viene premuto il backspace l'ultima lettere sarà cancellata
    if(e.key == "Backspace") {
        wordTyped = wordTyped.substring(0, wordTyped.length - 1);
    }
    /**
     * Se il tasto appena premuto è dentro l'arraw di lettere valide viene aggiunto
     * quindi previene tasti come numeri, shift, tab ecc...
     */
    if(legitKeys.includes(e.key, 0)) {
        wordTyped = wordTyped + e.key;
        typedEntries++;
        firstKeyDown--;
    }

    // Aggiorna a ogni tasto premuto la parola visionata
    wordTypedDom.textContent = wordTyped.toLowerCase();

    // Si controlla se la parola è stata terminata e si procede al calcolo
    if(checkWordPercentage()) {
        wordTypedDom.textContent = "";
        setNewWord();
    }
    
    showStats();
});

resetButton.addEventListener('click', () => {
    scoreBox.classList.add('hidden');
    overlay.classList.add('hidden');
});

// Imposta una nuova parola quando la precedente è stata terminata
function setNewWord() {
    let randomIndex = 0;
    randomIndex = Math.floor(Math.random() * (legitWords.length - 0) + 0);
    wordToTypeDom.textContent = legitWords[randomIndex].toLowerCase();
    wordTyped = "";
}

// Controlla lo stato della parola attuale calcolando la percentuale
function checkWordPercentage() {
    let tmpWordToType = wordToTypeDom.textContent.toLowerCase();
    let tmpWordTyped = wordTypedDom.textContent.toLowerCase();
    let equalsLetterCount = 0, percentage = 0;
    let isEquals = false;

    if(tmpWordToType.length === tmpWordTyped.length) {
        for(let i = 0; i < tmpWordToType.length; i++) {
            if(tmpWordToType[i] === tmpWordTyped[i]) {
                equalsLetterCount++;
            }
        }
        percentage = Math.floor((equalsLetterCount / tmpWordToType.length) * 100);
        if(percentage === 100) {
            activeScore++;
            if(activeScore >= bestScore) {
                bestScore = activeScore;
            }
        }
        else {
            activeScore = 0;
        }
        isEquals = true;
    }

    return isEquals;
}

function showStats() {
    document.getElementById("word-per-minute").textContent = "WPM: 0";
    document.getElementById("best-score-word").textContent = "BSW: " +  bestScore;
    document.getElementById("active-score-word").textContent = "ASW: " +  activeScore;
}

function startTimer(seconds) {
    let remainingSeconds = seconds;
  
    function updateTimer() {
      if (remainingSeconds >= 0) {
        const displayMinutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
        const displaySeconds = (remainingSeconds % 60).toString().padStart(2, '0');
        const timerDisplay = `${displayMinutes}:${displaySeconds}`;
        document.getElementById("timer").textContent = timerDisplay + "s";
        remainingSeconds--;
      } else {
        endGame();
        clearInterval(intervalID);
      }
    }
  
    const intervalID = setInterval(updateTimer, 1000);
}

// Funzione per registrare il primo keydown per iniziare il gioco
function handleFirstKeyDown() {
    document.removeEventListener("keydown", handleFirstKeyDown);
    startTimer(60);
}

function endGame() {
    scoreBox.classList.remove('hidden');
    overlay.classList.remove('hidden');

    wordTypedDom.textContent = "GAME FINISHED!";
}
