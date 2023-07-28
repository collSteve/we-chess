export class ChessEngine {
    board: string[][];
    constructor() {
        this.board = []
    }
    getBoard() {
        return this.board;
    }
    getBoardState() {
        return 'checkmate';
    }
}