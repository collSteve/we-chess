import { Card, CardHeader, CardBody, CardFooter, Heading, FormLabel, Input, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket, getSocket2 } from '~/services/websocket';
import { io, type Socket } from 'socket.io-client';

let socket: Socket;



export default function CreateJoinGamePage() {

    const router = useRouter();

    // const socket = getSocket2();

    const socketSetup = (socekt: Socket) => {
        socket.on('roomCreated', (roomId: string) => {
            router.push(`/play-chess-pvp/${roomId}`);
        });
    }

    const [userName, setUserName] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');

    const handleOnJoinRoom = (roomId: string) => {
        socket.emit('joinRoom', roomId, userName);
        router.push(`/play-chess-pvp/${roomId}`);
    };

    const handleOnCreateRoom = () => {
        if (!socket) {
            console.log('socket is not ready');
            return;
        }
        console.log('create clicked');
        socket.emit('createRoom', userName);
    };

    const socketInit = async () => {
        await fetch('/api/socket');
        socket = io({path: '/api/socket_io'});
        socketSetup(socket);
    }

    useEffect(() => {
        // getSocket().then((fetchedSocket: Socket) => {
        //     socket = fetchedSocket;
        //     socket.on('roomCreated', (roomId: string) => {
        //         router.push(`/play-chess-pvp`, {query: {roomId: roomId}});
        //     });
        // });

        getSocket().then((fetchedSocket) => {
            socket = fetchedSocket;
            socketSetup(socket);
        });

        // socketInit();

        // fetch('/api/socket').finally(() => {
        //     socket = io({path: '/api/socket_io'});
        //     socket.on('roomCreated', (roomId: string) => {
        //         router.push(`/play-chess-pvp`, { query: { roomId: roomId } });
        //     });
        // });


    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', justifyContent: 'space-around' }}>
            <Card>
                <CardHeader>
                    <Heading>Join in a Room</Heading>
                </CardHeader>
                <CardBody>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder='Your name' value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                    <FormLabel>Room ID</FormLabel>
                    <Input placeholder='Your room ID' value={roomId} onChange={(e) => { setRoomId(e.target.value) }} />
                </CardBody>
                <CardFooter>
                    <Button onClick={() => { handleOnJoinRoom(roomId) }}>Join</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <Heading>Create a Room</Heading>
                </CardHeader>
                <CardBody>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder='Your name' value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                </CardBody>
                <CardFooter>
                    <Button onClick={() => { handleOnCreateRoom() }}>Create</Button>
                </CardFooter>
            </Card>
        </div>
    );
}