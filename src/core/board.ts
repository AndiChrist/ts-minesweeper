import { Board } from "./types.js";

export function createBoard(rows: number, cols: number, mines: number): Board {
    const board: Board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            isMine: false,
            isRevealed: false,
            neighborMines: 0,
            isFlagged: false,
        }))
    );

    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            placed++;
        }
    }

    const dirs = [-1, 0, 1];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].isMine) continue;
            let count = 0;
            for (const dr of dirs) {
                for (const dc of dirs) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (
                        nr >= 0 &&
                        nc >= 0 &&
                        nr < rows &&
                        nc < cols &&
                        board[nr][nc].isMine
                    ) {
                        count++;
                    }
                }
            }
            board[r][c].neighborMines = count;
        }
    }

    return board;
}
