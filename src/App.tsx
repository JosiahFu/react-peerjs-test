import { useEffect, useState } from 'react';
import StringInput from './StringInput';
import Peer, { DataConnection } from 'peerjs';

function App() {
    const [id, setId] = useState<string>();
    const [friend, setFriend] = useState<string>();
    const [messages, setMessages] = useState<string[]>([]);

    const [peer, setPeer] = useState<Peer>();
    const [connection, setConnection] = useState<DataConnection>();

    useEffect(() => {
        if (!connection) return;
        const handler = (data: unknown) => {
            setMessages([...messages, data as string]);
        };
        connection.on('data', handler);
        return () => void connection.off('data', handler);
    }, [connection, messages]);

    useEffect(() => {
        if (!connection) return;
        const handler = () => {
            setConnection(undefined);
        };
        connection.on('close', handler);
        return () => void connection.off('close', handler);
    }, [connection, messages]);

    useEffect(() => {
        if (!id) {
            return;
        }
        const peer = new Peer(id);
        setPeer(peer);

        return () => {
            setPeer(undefined);
            peer.disconnect();
        }
    }, [id]);

    useEffect(() => {
        let connection: DataConnection;
        
        peer?.on('connection', conn => {
            connection = conn;
            setConnection(conn);
        });
        
        return () => {
            connection?.close();
            setConnection(undefined);
        }
    }, [peer]);

    useEffect(() => {
        if (!friend || !peer) return;
        const connection = peer.connect(friend);
        setConnection(connection);
        return () => {
            connection.close();
            setConnection(undefined)
        };
    }, [friend, peer]);

    const handleSend = (message: string) => {
        if (!connection) return;
        connection.send(message);
        setMessages([...messages, message]);
    };

    return (
        <>
            <h1>Peerjs test</h1>
            <h2>Id</h2>
            <StringInput onSubmit={setId} />
            <StringInput onSubmit={setFriend} />
            {messages.map((e, i) => (
                <p key={i}>{e}</p>
            ))}
            <StringInput onSubmit={handleSend} clear />
        </>
    );
}

export default App;
