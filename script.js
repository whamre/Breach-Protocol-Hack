const gridContainer = document.getElementById('grid-container');
const sequenceContainer = document.getElementById('sequence-container');
const messageDiv = document.getElementById('message');
const timerDiv = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const alphabet = '123456789ABCDEF';
let sequence = [];
let currentStep = 0;
let highlightedRow = 0;
let highlightedCol = 0;
let canMoveVertically = true;
let canMoveHorizontally = false;
let sequenceToWin = [];
let gridValues = [];
let timer;
let timeLeft = 20;

function createGrid() {
    gridContainer.innerHTML = '';
    gridValues = [];

    for (let row = 0; row < 6; row++) {
        let rowValues = [];
        for (let col = 0; col < 6; col++) {
            const div = document.createElement('div');
            div.classList.add('grid-item');
            div.dataset.row = row;
            div.dataset.col = col;
            let value = alphabet[Math.floor(Math.random() * alphabet.length)] + alphabet[Math.floor(Math.random() * alphabet.length)];
            div.textContent = value;
            div.classList.add('hidden');
            gridContainer.appendChild(div);
            rowValues.push(value);
        }
        gridValues.push(rowValues);
    }
}

function generateSequence() {
    sequenceToWin = [];
    let previousRow = Math.floor(Math.random() * 6);
    let previousCol = Math.floor(Math.random() * 6);
    sequenceToWin.push([previousRow, previousCol]);

    for (let i = 1; i < 5; i++) {
        let row, col;
        if (i % 2 === 0) {
            row = Math.floor(Math.random() * 6);
            col = previousCol;
        } else {
            row = previousRow;
            col = Math.floor(Math.random() * 6);
        }
        sequenceToWin.push([row, col]);
        previousRow = row;
        previousCol = col;
    }

    let sequenceValues = sequenceToWin.map(([row, col]) => gridValues[row][col]);
    let valueCounts = {};
    for (let value of sequenceValues) {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    }

    for (let value in valueCounts) {
        if (valueCounts[value] > 1) {
            let gridOccurrences = gridValues.flat().filter(v => v === value).length;
            if (gridOccurrences < valueCounts[value]) {
                generateSequence();
                return;
            }
        }
    }

    displaySequence();
}

function displaySequence() {
    sequenceContainer.innerHTML = "<strong>Sequence Required:</strong><br>" +
        sequenceToWin.map(([row, col]) => gridContainer.children[row * 6 + col].textContent).join(" -> ");
}

function clearHighlights() {
    document.querySelectorAll('.row-highlight, .col-highlight').forEach(element => {
        element.classList.remove('row-highlight', 'col-highlight');
    });
}

function highlightRowOrColumn() {
    clearHighlights();
    if (canMoveVertically) {
        for (let i = 0; i < 6; i++) {
            document.querySelector(`[data-row="${i}"][data-col="${highlightedCol}"]`).classList.add('col-highlight');
        }
    } else if (canMoveHorizontally) {
        for (let i = 0; i < 6; i++) {
            document.querySelector(`[data-row="${highlightedRow}"][data-col="${i}"]`).classList.add('row-highlight');
        }
    }
}

function moveHighlight(row, col) {
    document.querySelector('.highlighted').classList.remove('highlighted');
    highlightedRow = row;
    highlightedCol = col;
    document.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('highlighted');
    highlightRowOrColumn();
}

function handleKeydown(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        if (canMoveVertically) {
            const newRow = (highlightedRow + (event.key === 'ArrowUp' ? -1 : 1) + 6) % 6;
            moveHighlight(newRow, highlightedCol);
        }
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (canMoveHorizontally) {
            const newCol = (highlightedCol + (event.key === 'ArrowLeft' ? -1 : 1) + 6) % 6;
            moveHighlight(highlightedRow, newCol);
        }
    } else if (event.key === 'Enter') {
        checkSelection(highlightedRow, highlightedCol);
    }
}

function checkSelection(row, col) {
    const [expectedRow, expectedCol] = sequenceToWin[currentStep];
    if (row === expectedRow && col === expectedCol) {
        sequence.push({ row, col });
        currentStep++;
        if (currentStep === sequenceToWin.length) {
            messageDiv.textContent = 'You won!';
            clearInterval(timer);
        } else {
            canMoveVertically = !canMoveVertically;
            canMoveHorizontally = !canMoveHorizontally;
            highlightRowOrColumn();
        }
    } else {
        messageDiv.textContent = 'Wrong selection! Try again.';
    }
}

function updateTimer() {
    timeLeft--;
    timerDiv.textContent = `Time Left: ${timeLeft} seconds`;
    if (timeLeft <= 0) {
        clearInterval(timer);
        messageDiv.textContent = 'Time is up! You lost!';
        document.removeEventListener('keydown', handleKeydown);
        clearHighlights();
    }
}

function startGame() {
    gridContainer.classList.remove('hidden');
    document.querySelectorAll('.grid-item').forEach(item => item.classList.remove('hidden'));

    highlightedRow = sequenceToWin[0][0];
    highlightedCol = sequenceToWin[0][1];
    document.querySelector(`[data-row="${highlightedRow}"][data-col="${highlightedCol}"]`).classList.add('highlighted');

    timeLeft = 20;
    timerDiv.textContent = `Time Left: ${timeLeft} seconds`;
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    startButton.disabled = true;

    highlightRowOrColumn();
}

function initializeGame() {
    createGrid();
    generateSequence();
    displaySequence();

    gridContainer.classList.add('hidden');
    startButton.disabled = false;
}

initializeGame();

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeydown);
