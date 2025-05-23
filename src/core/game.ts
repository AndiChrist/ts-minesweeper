import { Board } from "./types.js";

export function reveal(board: Board, x: number, y: number): void {
    const cell = board[x]?.[y];
    if (!cell || cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.neighborMines === 0 && !cell.isMine) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx !== 0 || dy !== 0) {
                    reveal(board, x + dx, y + dy);
                }
            }
        }
    }
}

export function isGameWon(board: Board): boolean {
    return board.every(row =>
        row.every(cell =>
            (cell.isMine && !cell.isRevealed) ||
            (!cell.isMine && cell.isRevealed)
        )
    );
}
