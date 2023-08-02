import { NextApiRequest, NextApiResponse } from "next";

import { Server, type Socket } from 'socket.io';

import { Chess, PieceSymbol, Square, Color } from 'chess.js';

import Cors from 'cors'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const rooms: { [roomId: string]: { players: string[]; chessBoard: Chess } } = {};



const SocketHandler = async (req: any, res: any) => {
    await runMiddleware(req, res, cors);
    
    if (res.socket?.server.io) {
        // console.log('Socket is already running')
        res.end();
        return;
    }

    console.log('Socket is initializing')
    const io = new Server(res.socket.server, {
        path: "/api/socket",
        // addTrailingSlash: false
    });

    // res.socket.server.io = io;

    const onConnection = (socket: Socket) => {
        console.log('connection established');
        socket.on('createRoom', (playerInfo: string) => {
            const roomId = `room_${Math.random().toString(36).substring(2, 9)}`;
            socket.join(roomId);
            rooms[roomId] = {
                players: [playerInfo],
                chessBoard: new Chess(),
            };

            console.log('room created');
            socket.emit('roomCreated', roomId);
        });

        socket.on('joinRoom', (roomId: string, playerInfo: string) => {
            const room = rooms[roomId];

            if (room && room.players.length === 1) {
                socket.join(roomId);
                room.players.push(playerInfo);
                socket.emit('roomJoined', roomId, room.players[0]); // pass roomId and opponnent's playerInfo to sender
                socket.to(roomId).emit('playerJoined', playerInfo); // pass playerInfo to opponent
            } else {
                socket.emit('joinError', 'Room is full or does not exist.');
            }
        });

        socket.on('startGame', (roomId: string) => {
            const room = rooms[roomId];


            if (room && room.players.length === 2) {
                // TODO: initialize chess board
                room.chessBoard = new Chess();

                io.in(roomId).emit('gameStarted', room.chessBoard);
            } else {
                socket.emit('startGameError', 'Cannot start game, room is not ready.');
            }
        });

        /**
         * @param roomId
         * @param move: from: from sqaure, to: to square: i.e. {from: e2, to: e4}
         */
        socket.on('makeMove', (roomId: string, move: { from: string, to: string }) => {
            const room = rooms[roomId];

            if (room && room.players.length === 2) {
                // Process move and update chess board
                // send updated state to both players
                // TODO: Process and update chess board; And handle error moves
                try {
                    const chessMove = room.chessBoard.move({ from: move.from, to: move.to });

                    if (chessMove) {
                        // If the move is valid, send the updated chess board to both players
                        io.to(roomId).emit('moveMade', room.chessBoard);

                    } else {
                        // If the move is invalid, send error message back to player
                        socket.emit('makeMoveError', 'Invalid move.');
                    }
                } catch {
                    // If the move is invalid, send error message back to player
                    socket.emit('makeMoveError', 'Invalid move.');
                }
            } else {
                socket.emit('makeMoveError', 'Cannot make move, room is not ready.');
            }
        });

        socket.on('disconnect', () => {
            // TODO: handle disconnect
        });
    };

    io.on('connection', onConnection);


    res.socket.server.io = io;
    res.end();
}

export default SocketHandler;

// export default async function getFeedHandler(req: NextApiRequest, res: NextApiResponse) {
//     res.status(200).json({message: 'Hello World!'});
// }