const quoteDisplay = document.getElementById('quoteDisplay');
const quoteInput = document.getElementById('quoteInput');
const timeElement = document.getElementById('time');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const startBtn = document.getElementById('startBtn');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const progressBar = document.getElementById('progressBar');
const resultModal = document.getElementById('resultModal');
const resultWpm = document.getElementById('wpm-value');
const resultAccuracy = document.getElementById('accuracy-value');
const resultTime = document.getElementById('time-value');
const resultProgressBar = document.getElementById('resultProgressBar');
const feedbackMessage = document.getElementById('feedback-message');
const closeModalBtn = document.getElementById('closeModalBtn');

let time = 0;
let timer;
let isPlaying = false;
let wpm = 0;
let accuracy = 0;
let correctChars = 0;
let totalChars = 0;
let currentQuote = '';
let currentCharIndex = 0;

const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "The only way to learn a new programming language is by writing programs in it.",
    "The best error message is the one that never shows up.",
    "First, solve the problem. Then, write the code.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "The most disastrous thing that you can ever learn is your first programming language.",
    "The most important property of a program is whether it accomplishes the intention of its user.",
    "The function of good software is to make the complex appear to be simple.",
    "Simplicity is the soul of efficiency.",
    "Code is like humor. When you have to explain it, it's bad.",
    "Programming isn't about what you know; it's about what you can figure out.",
    "The only way to go fast is to go well.",
    "Clean code always looks like it was written by someone who cares.",
    "Truth can only be found in one place: the code."
];

function startGame() {
    if (isPlaying) return;
    
    isPlaying = true;
    time = 0;
    wpm = 0;
    accuracy = 0;
    correctChars = 0;
    totalChars = 0;
    currentCharIndex = 0;
    
    timeElement.textContent = "0s";
    wpmElement.textContent = "0";
    accuracyElement.textContent = "0%";
    progressBar.style.width = "0%";
    
    startBtn.style.display = 'none';
    newQuoteBtn.style.display = 'none';
    quoteInput.value = '';
    quoteInput.disabled = false;
    quoteInput.focus();
    
    timer = setInterval(() => {
        time++;
        timeElement.textContent = `${time}s`;
    }, 1000);
    
    getNewQuote();
}

function getNewQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = '';
    totalChars = currentQuote.length;
    
    currentQuote.split('').forEach((character, index) => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        if (index === 0) {
            characterSpan.classList.add('current');
        }
        quoteDisplay.appendChild(characterSpan);
    });
}

function checkText() {
    if (!isPlaying) return;
    
    const arrayQuote = quoteDisplay.querySelectorAll('span');
    const arrayValue = quoteInput.value.split('');
    
    arrayQuote.forEach(span => span.classList.remove('current'));
    
    let correct = true;
    let newCorrectChars = 0;
    
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
            
            if (index === arrayValue.length && index < arrayQuote.length) {
                characterSpan.classList.add('current');
                currentCharIndex = index;
            }
        } 
        else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            newCorrectChars++;
            
            if (index === arrayValue.length - 1 && index + 1 < arrayQuote.length) {
                arrayQuote[index + 1].classList.add('current');
                currentCharIndex = index + 1;
            }
        } 
        else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
            
            if (index === arrayValue.length - 1 && index < arrayQuote.length) {
                characterSpan.classList.add('current');
                currentCharIndex = index;
            }
        }
    });
    
    correctChars = newCorrectChars;
    accuracy = Math.round((correctChars / totalChars) * 100);
    accuracyElement.textContent = `${accuracy}%`;
    
    const progress = (arrayValue.length / totalChars) * 100;
    progressBar.style.width = `${progress}%`;
    
    if (correct) {
        finishGame();
    }
}

function calculateWPM() {
    const words = currentQuote.split(' ').length;
    const minutes = time / 60;
    wpm = Math.round(words / minutes);
    return wpm;
}

function finishGame() {
    clearInterval(timer);
    isPlaying = false;
    quoteInput.disabled = true;
    
    wpm = calculateWPM();
    accuracy = Math.round((correctChars / totalChars) * 100);
    
    wpmElement.textContent = wpm;
    accuracyElement.textContent = `${accuracy}%`;
    
    showResults();
    
    newQuoteBtn.style.display = 'inline-block';
}

function showResults() {
    resultWpm.textContent = wpm;
    resultAccuracy.textContent = `${accuracy}%`;
    resultTime.textContent = `${time}s`;
    resultProgressBar.style.width = `${accuracy}%`;
    
    if (accuracy === 100 && wpm > 60) {
        feedbackMessage.textContent = "Amazing! You're a typing wizard! 🚀";
        feedbackMessage.style.color = "var(--success)";
    } else if (accuracy >= 90 && wpm > 40) {
        feedbackMessage.textContent = "Great job! You're getting really good at this! 👍";
        feedbackMessage.style.color = "var(--success)";
    } else if (accuracy >= 80) {
        feedbackMessage.textContent = "Good work! Keep practicing to improve your speed and accuracy! 💪";
        feedbackMessage.style.color = "var(--accent)";
    } else if (accuracy >= 60) {
        feedbackMessage.textContent = "Not bad! Focus on accuracy first, then speed will come. 😊";
        feedbackMessage.style.color = "var(--warning)";
    } else {
        feedbackMessage.textContent = "Keep practicing! Try to focus on accuracy before speed. 🏋️‍♂️";
        feedbackMessage.style.color = "var(--danger)";
    }
    
    resultModal.style.display = "flex";
}

function closeResults() {
    resultModal.style.display = "none";
}

startBtn.addEventListener('click', startGame);
newQuoteBtn.addEventListener('click', startGame);
quoteInput.addEventListener('input', checkText);
closeModalBtn.addEventListener('click', closeResults);

getNewQuote();