import { Socket, io } from 'socket.io-client';

declare global {
    var socketIO: Socket | undefined;
}

const initializeSocketIO = () => {
    const url = `ws://${process.env.WEBSOCKET_HOST}:${process.env.WEBSOCKET_PORT}`;
    console.log('Socket connecting on:', url);
    const socket = io(url, {
        transports: ['websocket'],
        auth: { token: process.env.WEBSOCKET_TOKEN },
        parser: require("socket.io-msgpack-parser")
    });
    socket.on('connect', () => {
        console.log('Websocket connected.');
    });

    socket.on('disconnect', (reason) => {
        console.log('Websocket disconnected:', reason);
    });

    socket.on('connect_error', async (err: Error) => {
        console.log('Websocket error:', err.message);
        socket.close();
    });
    return socket;
}

const socketIO = globalThis.socketIO || initializeSocketIO();

if (process.env.NODE_ENV !== 'production') globalThis.socketIO = socketIO;


export default socketIO;
