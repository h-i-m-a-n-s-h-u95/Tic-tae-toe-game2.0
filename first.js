const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const human = "X";
const ai = "O";

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

restartBtn.addEventListener("click", restartGame);

function handleClick() {
    const index = this.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    makeMove(index, human);

    if (gameActive) {
        statusText.textContent = "Computer Thinking...";
        setTimeout(() => {
            let bestMove = minimax(board, ai).index;
            makeMove(bestMove, ai);
        }, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;

    if (checkWinner(player)) {
        statusText.textContent = player === human ? "You Win! 🎉" : "Computer Wins! 🤖";
        highlightWinner(player);
        gameActive = false;
    } else if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
    } else {
        statusText.textContent = player === human ? "Computer Turn..." : "Your Turn (X)";
    }
}

function checkWinner(player) {
    return winPatterns.some(pattern => 
        pattern.every(index => board[index] === player)
    );
}

function highlightWinner(player) {
    winPatterns.forEach(pattern => {
        if (pattern.every(index => board[index] === player)) {
            pattern.forEach(index => cells[index].classList.add("winner"));
        }
    });
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusText.textContent = "Your Turn (X)";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });
}


function minimax(newBoard, player) {
    let availableSpots = newBoard
        .map((val, idx) => val === "" ? idx : null)
        .filter(val => val !== null);

    if (checkWin(newBoard, human)) return { score: -10 };
    if (checkWin(newBoard, ai)) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === ai) {
            let result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === ai) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(boardState, player) {
    return winPatterns.some(pattern =>
        pattern.every(index => boardState[index] === player)
    );
}