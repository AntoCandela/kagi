// Vengono impostate le due variabili
let wordToType = "";
let wordTyped = "";

// Vengono impostate le due variabili DOM
let wordToTypeDom = document.getElementById("wordToType");
let wordTypedDom = document.getElementById("wordTyped");

// Array che identificano quali lettere sono valide e la lista di parole
let legitKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']
let legitWords = [];

let percentage = 0, bestScore = 0, activeScore = 0;

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

// Imposta una nuova parola quando la precedente è stata terminata
function setNewWord() {
    let newWord = "", randomIndex = 0;
    randomIndex = Math.floor(Math.random() * (legitWords.length - 0) + 0);
    newWord = legitWords[randomIndex];
    wordTyped = "";
    wordToTypeDom.textContent = newWord.toLowerCase();
}

// Controlla lo stato della parola attuale calcolando la percentuale
function checkWordPercentage() {
    let tmpWordToType = wordToTypeDom.textContent.toLowerCase();
    let tmpWordTyped = wordTypedDom.textContent.toLowerCase();
    let equalsLetterCount = 0;
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
    document.getElementById("last-percentage").textContent = "LWP: " +  percentage + "%";
    document.getElementById("best-score-word").textContent = "BSW: " +  bestScore;
    document.getElementById("active-score-word").textContent = "ASW: " +  activeScore;
}