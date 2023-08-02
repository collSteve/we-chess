import { CSSProperties, useEffect, useState } from "react";
import ChessBoard from "~/components/chess-board";
import Board from "~/components/chess-set/board";

import { Chess, PieceSymbol, Square, Color } from 'chess.js';
import ChessMovePanel from "~/components/chess-moves-panel";
// import { getSocket, getSocket2 } from "~/services/websocket";
import { useRouter } from "next/router";
import { io, type Socket } from "socket.io-client";
import { getSocket } from "~/services/websocket";

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



interface PvPProps {
    roomId: string;
}


const chess = new Chess(); // Initialize a new chess game

let socket: Socket;
export default function PlayChessPvPPage() {
    // const socket = getSocket2();

    const router = useRouter();

    const socketSetup = (socekt: Socket) => {
        socket.on('gameStarted', (initialBoard: Chess) => {
            chess.load(initialBoard.fen());
        });

        socket.on('playerJoined', (playerInfo: string) => {
            setPlayerName2(playerInfo);
        });

        socket.on('moveMade', (updatedBoard: Chess) => {
            // TODO: check if game won
            console.log('move made');
            chess.load(updatedBoard.fen());
            setSquares(chessJSBoard2Squares(chess.board()));
        });

        socket.on('makeMoveError', (error: string) => {
            console.log(error);
        });

        socket.on('joinError', error=>{
            console.log(`Join error: ${error}`);
        });

        socket.on('playerJoined', (playerInfo: string) => {
            console.log(`Player joined: ${playerInfo}`);
        });
    }

    useEffect(() => {

        // fetch('/api/socket').finally(() => {
        //     socket = io({ path: '/api/socket_io' });

        //     socketSetup(socket);
        // });


        getSocket().then((fetchedSocket) => {
            socket = fetchedSocket;
            socketSetup(socket);
        });

    }, []);

    const roomId = router.query.roomId as string;

    const [squares, setSquares] = useState(chessJSBoard2Squares(chess.board())); // Get the initial board state
    const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null); // Store the selected square coordinates

    const [moves, setMoves] = useState<string[]>(chess.history()); // Store the moves made so far

    const [displayMoveIndex, setDisplayMoveIndex] = useState<number>(0);


    // players info
    const [playerName1, setPlayerName1] = useState<string>(''); // current player name
    const [playerName2, setPlayerName2] = useState<string>(''); // opponent player name

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

                if (move) {
                    setSelectedSquare(null);

                    // If move is valid, send to socket
                    socket.emit('makeMove', roomId, { from, to });
                    console.log('make move sent');

                    // If the move is valid, update the chessboard and clear the selection
                    setSquares(chessJSBoard2Squares(chess.board()));


                    // set moves history
                    setMoves(chess.history());
                    setDisplayMoveIndex(chess.history().length - 1);

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
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Board squares={squares} onSquareClick={handleSquareClick} />
            <ChessMovePanel
                moves={moves}
                moveIndex={displayMoveIndex}
                onMoveClick={(index) => {
                    setDisplayMoveIndex(index);
                    const moveIndexHistory = chess.history({ verbose: true })[index];
                    const fenAfterMove = moveIndexHistory?.after;

                    // TODO: make a fen to squares util so I don't need to create a new CHess object everytime 
                    const board = (new Chess(fenAfterMove)).board();

                    setSquares(chessJSBoard2Squares(board));
                }} />
            <h1>{displayMoveIndex}</h1>
        </div>
        // <ChessBoard style={{width: '500px', height: '500px'}} ></ChessBoard>
    );
}