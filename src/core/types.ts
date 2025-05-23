export type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    neighborMines: number;
    isFlagged: boolean;
};

export type Board = Cell[][];
