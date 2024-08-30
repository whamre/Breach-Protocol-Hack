document.addEventListener("DOMContentLoaded", function() {
    const matrixSize = 4;
    const codes = ["55", "1C", "BD", "E9"];
    const sequenceLength = 4;
    let buffer = [];
    let codeMatrix = [];
    let requiredSequence = [];

    let currentRow = 0;
    let currentCol = 0;
    let isVertical = false;

    const matrixElement = document.getElementById("codeMatrix");
    const bufferElement = document.getElementById("buffer");
    const sequenceElement = document.getElementById("sequence");

    function generateRandomSequence() {
        requiredSequence = [];
        for (let i = 0; i < sequenceLength; i++) {
            let randomCode = codes[Math.floor(Math.random() * codes.length)];
            requiredSequence.push(randomCode);
        }
        sequenceElement.textContent = requiredSequence.join(" ");
    }

    function generateSolvableMatrix() {
        codeMatrix = [];
        for (let i = 0; i < matrixSize; i++) {
            let row = [];
            for (let j = 0; j < matrixSize; j++) {
                let randomCode = codes[Math.floor(Math.random() * codes.length)];
                row.push(randomCode);
            }
            codeMatrix.push(row);
        }

        let row = 0;
        let col = Math.floor(Math.random() * matrixSize);

        for (let i = 0; i < sequenceLength; i++) {
            codeMatrix[row][col] = requiredSequence[i];
            if (i % 2 === 0 && row < matrixSize - 1) {
                row++;
            } else if (col < matrixSize - 1) {
                col++;
            }
        }
    }

    function createMatrix() {
        matrixElement.innerHTML = "";
        codeMatrix.forEach((row, rowIndex) => {
            const tr = document.createElement("tr");
            row.forEach((code, colIndex) => {
                const td = document.createElement("td");
                td.textContent = code;
                td.dataset.row = rowIndex;
                td.dataset.col = colIndex;
                tr.appendChild(td);
            });
            matrixElement.appendChild(tr);
        });
        highlightCurrentCell();
    }

    function highlightCurrentCell() {
        document.querySelectorAll("td").forEach(cell => {
            cell.classList.remove("highlighted");
        });
        const currentCell = matrixElement.querySelector(`td[data-row="${currentRow}"][data-col="${currentCol}"]`);
        if (currentCell) {
            currentCell.classList.add("highlighted");
        }
    }

    function handleKeyPress(event) {
        switch (event.key) {
            case "ArrowRight":
                if (!isVertical && currentCol < matrixSize - 1) {
                    currentCol++;
                }
                break;
            case "ArrowLeft":
                if (!isVertical && currentCol > 0) {
                    currentCol--;
                }
                break;
            case "ArrowDown":
                if (isVertical && currentRow < matrixSize - 1) {
                    currentRow++;
                }
                break;
            case "ArrowUp":
                if (isVertical && currentRow > 0) {
                    currentRow--;
                }
                break;
            case "Enter":
                handleCodeClick(codeMatrix[currentRow][currentCol]);
                isVertical = !isVertical;
                break;
        }
        highlightCurrentCell();
    }

    function handleCodeClick(code) {
        buffer.push(code);
        updateBufferDisplay();
        if (buffer.length === requiredSequence.length) {
            checkSequence();
        }
    }

    function updateBufferDisplay() {
        bufferElement.innerHTML = "";
        buffer.forEach(code => {
            const div = document.createElement("div");
            div.textContent = code;
            bufferElement.appendChild(div);
        });
    }

    function checkSequence() {
        if (buffer.join(" ") === requiredSequence.join(" ")) {
            alert("Sequence matched! Hacking successful.");
        } else {
            alert("Sequence mismatch! Hacking failed.");
        }
        resetGame();
    }

    function resetGame() {
        buffer = [];
        currentRow = 0;
        currentCol = 0;
        isVertical = false;
        generateRandomSequence();
        generateSolvableMatrix();
        createMatrix();
        updateBufferDisplay();
    }

    resetGame();

    document.addEventListener("keydown", handleKeyPress);
});
