import { CSSProperties, useState } from "react";
import ChessBoard from "~/components/chess-board";
import Board from "~/components/chess-set/board";

import { Chess, PieceSymbol, Square, Color } from 'chess.js';
import ChessMovePanel from "~/components/chess-moves-panel";

type ChessJSBoardElement = {
    square: Square;
    type: PieceSymbol;
    color: Color;
} | null;

function generateEmptySquares() {
    const squares: string[][] = [];
    for (let i = 0; i < 8; i++) {
        squares.push([]);
        for (let j = 0; j < 8; j++) {
            (squares[i] as string[]).push('');
        }
    }
    return squares;
}

function chessJSBoard2Squares(board: ChessJSBoardElement[][]) {
    const squares: string[][] = generateEmptySquares();
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const chessJSelement = (board[i] as ChessJSBoardElement[])[j];
            let piece = ''
            if (chessJSelement) {
                const { color, type } = chessJSelement;
                piece = `${color}${type}`;
            }
            (squares[i] as string[])[j] = piece;
        }
    }
    return squares;
}

function chessJSVerboseHistory2Moves(history: any[]) {

}

const chess = new Chess(); // Initialize a new chess game


export default function PlayChessPage() {
    const [squares, setSquares] = useState(chessJSBoard2Squares(chess.board())); // Get the initial board state
    const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null); // Store the selected square coordinates

    const [moves, setMoves] = useState<string[]>(chess.history()); // Store the moves made so far

    const handleSquareClick = (row: number, col: number) => {
        console.log(selectedSquare);
        if (selectedSquare) {
            // If a square is already selected, try to make a move
            const [selectedRow, selectedCol] = selectedSquare;
            const from = `${String.fromCharCode(97 + selectedRow)}${8 - selectedCol}`;
            const to = `${String.fromCharCode(97 + row)}${8 - col}`;

            console.log(`from: ${from}, to: ${to}`);

            try {
                const move = chess.move({ from, to });
                console.log(chess.board());
                if (move) {
                    // If the move is valid, update the chessboard and clear the selection
                    setSquares(chessJSBoard2Squares(chess.board()));
                    setSelectedSquare(null);

                    // set moves history
                    setMoves(chess.history());

                } else {
                    // If the move is invalid, clear the selection
                    setSelectedSquare(null);
                }
            } catch {
                // If the move is invalid, clear the selection
                console.log('invalid move');
                setSelectedSquare(null);
            }

        } else {
            // console.log('called set selected');
            // If no square is selected, set the selected square
            setSelectedSquare([row, col]);
        }
    };


    return (
        <div style={{display: "flex", flexDirection: "row"}}>
            <Board squares={squares} onSquareClick={handleSquareClick} />
            <ChessMovePanel moves={moves} onMoveClick={(index)=>{console.log(moves[index])}}></ChessMovePanel>
        </div>
        // <ChessBoard style={{width: '500px', height: '500px'}} ></ChessBoard>
    );
}