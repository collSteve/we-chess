import { io, Socket } from 'socket.io-client';
let socket: Socket;

export const initializeSocket = async () => {
    await fetch('/api/socket');
    socket = io({ path: "/api/socket_io" });
    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
    return socket;
};

export const initializeSocket2 = () => {
    socket = io({ path: "/api/socket_io" });
    socket.on('connect', () => {
        console.log('connected');
    });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
    return socket;
};

export const getSocket = async () => {
    if (socket) {
        return socket;
    } else {
        return await initializeSocket();
    }
}

export const getSocket2 = () => {
    if (socket) {
        return socket;
    } else {
        return initializeSocket2();
    }
}