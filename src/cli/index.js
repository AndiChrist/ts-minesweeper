import promptSync from "prompt-sync";
import { createBoard } from "../core/board.js";
import { reveal, isGameWon } from "../core/game.js";
const prompt = promptSync();
const rows = 8;
const cols = 8;
const mines = 10;
let board = createBoard(rows, cols, mines);
let gameOver = false;
function printBoard() {
    console.log("   " + [...Array(cols).keys()].map(n => n.toString()).join(" "));
    board.forEach((row, r) => {
        const line = row
            .map(cell => {
            if (cell.isRevealed) {
                return cell.isMine ? "*" : cell.neighborMines.toString();
            }
            else {
                return ".";
            }
        })
            .join(" ");
        console.log(`${r}  ${line}`);
    });
}
while (!gameOver) {
    printBoard();
    const input = prompt("Zelle (Format: x y): ");
    const [xStr, yStr] = input.trim().split(" ");
    const x = parseInt(xStr);
    const y = parseInt(yStr);
    if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= rows || y >= cols) {
        console.log("Ungültige Eingabe.");
        continue;
    }
    const cell = board[x][y];
    if (cell.isMine) {
        console.log("💥 BOOM! Du bist auf eine Mine getreten.");
        gameOver = true;
        cell.isRevealed = true;
        printBoard();
    }
    else {
        reveal(board, x, y);
        if (isGameWon(board)) {
            console.log("🎉 Glückwunsch! Du hast gewonnen.");
            gameOver = true;
            printBoard();
        }
    }
}
