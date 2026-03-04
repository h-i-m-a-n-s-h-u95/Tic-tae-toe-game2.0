const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

restartBtn.addEventListener("click", restartGame);

function handleClick() {
    const index = this.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    this.textContent = currentPlayer;

    checkWinner();

    if (gameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            statusText.textContent = `Player ${board[a]} Wins! 🎉`;
            gameActive = false;

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");
            return;
        }
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
    }
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = "Player X's Turn";

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winner");
    });
}