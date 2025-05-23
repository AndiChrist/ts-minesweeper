import { Cell } from "./Cell.js";
import chalk from "chalk";

export class Board {
    grid: Cell[][];
    width: number;
    height: number;
    mineCount: number;
    isGameOver = false;

    constructor(width: number, height: number, mineCount: number) {
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;
        this.grid = this.createGrid();
        this.placeMines();
        this.calculateSurroundings();
    }

    private createGrid(): Cell[][] {
        return Array.from({ length: this.height }, () =>
            Array.from({ length: this.width }, () => new Cell())
        );
    }

    private placeMines() {
        let placed = 0;
        while (placed < this.mineCount) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            if (!this.grid[y][x].hasMine) {
                this.grid[y][x].hasMine = true;
                placed++;
            }
        }
    }

    private calculateSurroundings() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x].hasMine) continue;
                this.grid[y][x].surroundingMines = this.countMinesAround(x, y);
            }
        }
    }

    private countMinesAround(x: number, y: number): number {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (this.inBounds(nx, ny) && this.grid[ny][nx].hasMine) {
                    count++;
                }
            }
        }
        return count;
    }

    private inBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    reveal(x: number, y: number): void {
        if (!this.inBounds(x, y) || this.grid[y][x].isRevealed || this.grid[y][x].isFlagged) return;

        const cell = this.grid[y][x];
        cell.isRevealed = true;

        if (cell.hasMine) {
            this.isGameOver = true;
            return;
        }

        if (cell.surroundingMines === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    this.reveal(x + dx, y + dy);
                }
            }
        }
    }

    toggleFlag(x: number, y: number): void {
        if (!this.inBounds(x, y) || this.grid[y][x].isRevealed) return;
        this.grid[y][x].isFlagged = !this.grid[y][x].isFlagged;
    }

    print(): void {
        console.log("\n  " + [...Array(this.width).keys()].map(n => n.toString().padStart(2)).join(" "));
        this.grid.forEach((row, y) => {
            const line = row.map(cell => {
                if (cell.isFlagged) return chalk.yellow("⚑ ");
                if (!cell.isRevealed) return chalk.gray("■ ");
                if (cell.hasMine) return chalk.red("💣");
                if (cell.surroundingMines > 0) {
                    return chalk.cyan(`${cell.surroundingMines} `);
                }
                return "  ";
            }).join(" ");
            console.log(y.toString().padStart(2) + " " + line);
        });
    }

    isWon(): boolean {
        for (let row of this.grid) {
            for (let cell of row) {
                if (!cell.hasMine && !cell.isRevealed) {
                    return false;
                }
            }
        }
        return true;
    }

}
