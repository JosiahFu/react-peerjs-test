import Peer, { DataConnection } from 'peerjs';
import { useEffect, useRef, useState } from 'react';

function useClientState<T>(peerId: string | undefined): [T | undefined, (value: T) => void, connected: boolean];
function useClientState<T>(peerId: string | undefined, initialState: T): [T, (value: T) => void, connected: boolean];
function useClientState<T>(peerId: string | undefined, initialState?: T): [T | undefined, (value: T) => void, connected: boolean] {
    const [state, setState] = useState(initialState);

    const [peer, setPeer] = useState<Peer>();
    const [connection, setConnection] = useState<DataConnection>();

    useEffect(() => {
        const newPeer = new Peer();

        setPeer(newPeer);
        return () => {
            newPeer.destroy();
            setPeer(undefined);
            setConnection(undefined);
        }
    }, []);

    useEffect(() => {
        if (peer === undefined || peerId === undefined) return;
        const newConnection = peer.connect(peerId);
        setConnection(newConnection);
        return () => {
            newConnection.close();
            setConnection(undefined);
        }
    }, [peer, peerId]);

    useEffect(() => {
        if (connection === undefined) return;
        connection.on('data', data => {
            setState(data as T);
        });
        connection.on('close', () => {
            setConnection(undefined);
        });
        connection.on('error', error => {
            alert(`An error occurred: ${error.type}`)
        })
    }, [connection])

    const handleSetState = (value: T) => {
        setState(value);
        connection?.send(value);
    }

    return [state, handleSetState, connection?.open ?? false];
}

function useHostState<T>(id?: string): [state: T | undefined, setState: (value: T) => void, identifier: string | undefined, connections: number];
function useHostState<T>(id: string | undefined, initialState: T): [state: T, setState: (value: T) => void, identifier: string | undefined, connections: number];
function useHostState<T>(identifier: string | undefined, initialState?: T) {
    const [id, setId] = useState<string>();
    const [state, setState] = useState(initialState);
    const stateRef = useRef(state);
    stateRef.current = state;

    const [_, setPeer] = useState<Peer>();
    const [connections, setConnections] = useState<DataConnection[]>([]);

    useEffect(() => {
        const newPeer = identifier ? new Peer(identifier) : new Peer();
        newPeer.on('open', () => setId(newPeer.id!));

        newPeer.on('connection', newConnection => {
            setConnections(connections => [...connections, newConnection]);
            newConnection.on('open', () => {
                newConnection.send(stateRef.current);
            });
        });

        setPeer(newPeer);
        return () => {
            newPeer.destroy();
            setPeer(undefined);
            setId(undefined);
            setConnections([]);
        }
    }, [identifier]);

    useEffect(() => {
        connections.forEach(connection => {
            connection.on('data', data => {
                setState(data as T);
                connections.filter(e => e !== connection).map(otherConnection => {
                    otherConnection.send(data);
                });
            });

            connection.on('close', () => {
                setConnections(connections.filter(e => e !== connection));
            })

            connection.on('error', error => {
                alert(`An error occurred: ${error.type}`)
            })
        });

        return () => {
            connections.forEach(connection => {
                connection.off('data');
                connection.off('close');
                connection.off('error');
            });
        }
    }, [connections]);

    const handleSetState = (value: T) => {
        setState(value);
        connections.forEach(e => e.send(value));
    }

    return [state, handleSetState, id, connections.length];
}

export { useClientState, useHostState };
