import React, { useState } from "react";
import { Board } from "../../src/core/Board";

const boardWidth = 10;
const boardHeight = 10;
const mineCount = 10;

const board = new Board(boardWidth, boardHeight, mineCount);

export default function App() {
    const [, forceUpdate] = useState(0); // Trigger re-render

    const handleLeftClick = (x: number, y: number) => {
        if (!board.isGameOver && !board.isWon()) {
            board.reveal(x, y);
            forceUpdate(n => n + 1);
        }
    };

    const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
        e.preventDefault();
        if (!board.isGameOver && !board.isWon()) {
            board.toggleFlag(x, y);
            forceUpdate(n => n + 1);
        }
    };

    const getCellDisplay = (cell: any) => {
        if (cell.isFlagged) return "🚩";
        if (!cell.isRevealed) return "";
        if (cell.hasMine) return "💣";
        return cell.surroundingMines > 0 ? cell.surroundingMines : "";
    };

    return (
        <div className="app">
            <h1>Minesweeper</h1>
            {board.isGameOver && <div className="message">💥 Game Over!</div>}
            {board.isWon() && <div className="message">🎉 You Win!</div>}

            <div className="board">
                {board.grid.map((row, y) => (
                    <div key={y} className="row">
                        {row.map((cell, x) => (
                            <button
                                key={x}
                                className={`cell ${cell.isRevealed ? "revealed" : ""}`}
                                onClick={() => handleLeftClick(x, y)}
                                onContextMenu={(e) => handleRightClick(e, x, y)}
                            >
                                {getCellDisplay(cell)}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
