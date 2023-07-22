"use strict";

// Vengono impostate le due variabili
let wordToType = "";
let wordTyped = "";

// Vengono impostate le due variabili DOM
let wordToTypeDom = document.getElementById("wordToType");
let wordTypedDom = document.getElementById("wordTyped");
let buttonStart = document.getElementById("btn-start");

// Array che identificano quali lettere sono valide e la lista di parole
let legitKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']
let legitWords = [];

let bestScore = 0, activeScore = 0, firstKeyDown = 1, typedEntries = 0;
let canType = false;

let gameTimer = 59;
  
window.addEventListener("load", (e) => {
    // Recuperiamo i dati 
    fetch("../docs/words.txt")
        .then((res) => res.text())
        .then((text) => { 
            legitWords = text.replace(/(\r\n|\n|\r)/gm, "").split(',');
        })
    .catch((e) => console.error(e));
});

// Appena si clicca il pulsante per iniziare
buttonStart.addEventListener("click", () => {
    canType = true;
    buttonStart.classList.add("hidden");
    startTimer(gameTimer);
    setNewWord();
});

window.addEventListener("keydown", (e) => {
    if(canType) {
        // Se viene premuto il backspace l'ultima lettere sarà cancellata
        if(e.key == "Backspace") {
            wordTyped = wordTyped.substring(0, wordTyped.length - 1);
        }
        /**
         * Se il tasto appena premuto è dentro l'array di lettere valide viene aggiunto
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
        if(checkWords()) {
            setNewWord();
        }
        // Mostra le statistiche a ogni tasto premuto utile per il WPM
        showStats();
    }
});

// Imposta una nuova parola quando la precedente è stata terminata
function setNewWord() {
    let randomIndex = 0;
    randomIndex = Math.floor(Math.random() * (legitWords.length - 0) + 0);
    wordToTypeDom.textContent = legitWords[randomIndex].toLowerCase();
    // Reset della parola scritta
    wordTypedDom.textContent = "";
    wordTyped = "";
}

// Controlla lo stato della parola attuale calcolando la percentuale
function checkWords() {
    let tmpWordToType = wordToTypeDom.textContent.toLowerCase();
    let tmpWordTyped = wordTypedDom.textContent.toLowerCase();
    let isEquals = false;

    if(tmpWordToType.length === tmpWordTyped.length) {
        if(tmpWordToType == tmpWordTyped) {
            activeScore += 1;
            if(activeScore > bestScore) {
                bestScore = activeScore;
            }
        }
        else {
            activeScore = 0;
        }
        // Si ritorna true quando le due parole sono lunghe uguali
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
        if(remainingSeconds >= 0) {
            const displayMinutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
            const displaySeconds = (remainingSeconds % 60).toString().padStart(2, '0');
            const timerDisplay = `${displaySeconds}s`;
            document.getElementById("timer").textContent = timerDisplay;
            remainingSeconds--;
        } else {
            clearInterval(intervalID);
            gameReset();
        }
    }
  
    const intervalID = setInterval(updateTimer, 1000);
}

function gameReset() {
    buttonStart.classList.remove("hidden");
    wordTypedDom.textContent = "";
    wordTyped = "";
    activeScore = 0;
    canType = false;
}