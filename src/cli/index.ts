// src/cli/index.ts
import promptSync from "prompt-sync";
import { Board } from "../core/Board.js";

const prompt = promptSync({ sigint: true });

const width = 10;
const height = 10;
const mines = 10;

const board = new Board(width, height, mines);

console.log("🧨 Willkommen bei Minesweeper!");
console.log("Befehle:");
console.log("  r x y   → Feld aufdecken (reveal)");
console.log("  f x y   → Flagge setzen/entfernen (flag)");
console.log("  q       → Spiel beenden");

while (!board.isGameOver) {
    board.print();

    const input = prompt("> ");
    if (!input) continue;

    const [command, xs, ys] = input.trim().split(" ");
    if (command === "q") {
        console.log("👋 Spiel beendet.");
        process.exit(0);
    }

    const x = parseInt(xs, 10);
    const y = parseInt(ys, 10);
    if (isNaN(x) || isNaN(y)) {
        console.log("❌ Ungültige Koordinaten! Bitte ganze Zahlen eingeben.");
        continue;
    }

    if (command === "r") {
        board.reveal(x, y);
        if (board.isGameOver) {
            console.log("💥 Boom! Du bist auf eine Mine getreten!");
            board.print();
            break;
        }
    } else if (command === "f") {
        board.toggleFlag(x, y);
    } else {
        console.log("❓ Unbekannter Befehl. Bitte 'r', 'f' oder 'q' verwenden.");
    }

    if (board.isWon()) {
        console.log("🎉 Glückwunsch! Du hast alle sicheren Felder gefunden!");
        board.print();
        break;
    }
}

console.log("🏁 Spiel vorbei.");
