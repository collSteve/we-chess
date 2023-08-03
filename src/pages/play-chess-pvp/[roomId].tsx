import { CSSProperties, useEffect, useRef, useState } from "react";
import ChessBoard from "~/components/chess-board";
import Board from "~/components/chess-set/board";

import { Chess, PieceSymbol, Square, Color, Move } from 'chess.js';
import ChessMovePanel from "~/components/chess-moves-panel";
// import { getSocket, getSocket2 } from "~/services/websocket";
import { useRouter } from "next/router";
import { io, type Socket } from "socket.io-client";
import { getSocket } from "~/services/websocket";
import { chess2Square } from "~/utils/square-conversion";
import { ToastId, useToast } from '@chakra-ui/react'

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
    const toastIdRef = useRef<ToastId>();

    const chakraToast = useToast();
    const playerJoinedToastId = 'playerJoinedToastId';

    const roomId = router.query.roomId;

    const [gameStarted, setGameStarted] = useState<boolean>(false);

    const [squares, setSquares] = useState(chessJSBoard2Squares(chess.board())); // Get the initial board state
    const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null); // Store the selected square coordinates

    const [moves, setMoves] = useState<string[]>(chess.history()); // Store the moves made so far

    const [displayMoveIndex, setDisplayMoveIndex] = useState<number>(-1);

    const [previousMove, setPreviousMove] = useState<{from:string, to:string, [key: string]: any} | null>(null); // Store the previous move made


    // players info
    const [playerName1, setPlayerName1] = useState<string>(''); // current player name
    const [playerName2, setPlayerName2] = useState<string>(''); // opponent player name

    const [playerPiece, setPlayerPiece] = useState<'w'|'b'|null>(null); // current player color

    const showPlayerJoinedToast = () => {
        if (!chakraToast.isActive(playerJoinedToastId)) {
            toastIdRef.current = chakraToast({
                id: playerJoinedToastId,
                title: 'Player joined',
            });
        }
        
    }

    const socketSetup = (socket: Socket) => {
        socket.on('gameStarted', (initialBoardPGN: string) => {
            chess.loadPgn(initialBoardPGN);
            setGameStarted(true);
        });

        socket.on('playerJoined', (playerInfo: string) => {
            setPlayerName2(playerInfo);
            showPlayerJoinedToast();
        });

        socket.on('moveMade', (updatedBoardPGN: string, chessMove: Move) => {
            // TODO: check if game won
            chess.loadPgn(updatedBoardPGN);
            setSquares(chessJSBoard2Squares(chess.board()));

            setMoves(chess.history());
            setDisplayMoveIndex(chess.history().length - 1);

            // update preious move
            setPreviousMove(chessMove);
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

        socket.on('pieceAssigned', (roomId: string, piece: 'w'|'b') => {
            setPlayerPiece(piece);
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

    const isPlayerTurn = (currentMovePiece: Color)=>{
        return gameStarted && (currentMovePiece === playerPiece) && displayMoveIndex == moves.length - 1;
    };


    const handleSquareClick = (row: number, col: number) => {
        console.log(selectedSquare);
        if (selectedSquare && isPlayerTurn(chess.turn())) {
            // If a square is already selected, try to make a move
            const [selectedRow, selectedCol] = selectedSquare;
            const from = `${String.fromCharCode(97 + selectedRow)}${8 - selectedCol}`;
            const to = `${String.fromCharCode(97 + row)}${8 - col}`;

            console.log(`from: ${from}, to: ${to}`);

            try {
                const move = chess.move({ from, to });

                if (move) {
                    console.log(move);
                    setSelectedSquare(null);

                    // If move is valid, send to socket
                    socket.emit('makeMove', roomId, { from, to });
                    console.log('make move sent');

                    // If the move is valid, update the chessboard and clear the selection
                    // setSquares(chessJSBoard2Squares(chess.board()));


                    // // set moves history
                    // setMoves(chess.history());
                    // setDisplayMoveIndex(chess.history().length - 1);

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

    // const [specialSquares, setSpecialSquares] = useState<{ highlight?: [number, number][], emphasis?: [number, number][] }>({ highlight: [] });

    const resolveSpecialSquare = ()=>{
        const highlights = [];

        console.log('previous move', previousMove);

        if (previousMove) {
            highlights.push(chess2Square(previousMove.from));
            highlights.push(chess2Square(previousMove.to));
        }

        if (selectedSquare) highlights.push(selectedSquare);

        return {
            'highlight': highlights
        }
    };

    // useEffect(() => {
    //     console.log('special called');
    //     const highlights = [];
    //     if (previousMove) {
    //         highlights.push(chess2Square(previousMove?.from));
    //         highlights.push(chess2Square(previousMove?.to));
    //     }

    //     if (selectedSquare) highlights.push(selectedSquare);


    //     setSpecialSquares({
    //         'highlight': highlights
    //     });

    //     console.log(specialSquares);

    // }, [previousMove, selectedSquare]);

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Board playerPiece={playerPiece??undefined} squares={squares} onSquareClick={handleSquareClick} selectedSquare={selectedSquare} specialSquares={resolveSpecialSquare()} />
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
            <h1>My Color: {playerPiece}</h1>
        </div>
        // <ChessBoard style={{width: '500px', height: '500px'}} ></ChessBoard>
    );
}