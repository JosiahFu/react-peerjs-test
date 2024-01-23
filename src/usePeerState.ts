import Peer, { DataConnection } from 'peerjs';
import { useEffect, useRef, useState } from 'react';

function useClientState<T>(selfId: string | undefined, peerId: string | undefined): [T | undefined, (value: T) => void, connected: boolean];
function useClientState<T>(selfId: string | undefined, peerId: string | undefined, initialState: T): [T, (value: T) => void, connected: boolean];
function useClientState<T>(selfId: string | undefined, peerId: string | undefined, initialState?: T): [T | undefined, (value: T) => void, connected: boolean] {
    const [state, setState] = useState(initialState);

    const [peer, setPeer] = useState<Peer>();
    const [connection, setConnection] = useState<DataConnection>();

    useEffect(() => {
        if (selfId === undefined) return;
        const newPeer = new Peer(selfId);

        setPeer(newPeer);
        return () => {
            newPeer.destroy();
            setPeer(undefined);
            setConnection(undefined);
        }
    }, [selfId]);

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

    return [state, handleSetState, connection !== undefined];
}

function useHostState<T>(selfId: string | undefined): [T | undefined, (value: T) => void, connections: number];
function useHostState<T>(selfId: string | undefined, initialState: T): [T, (value: T) => void, connections: number];
function useHostState<T>(selfId: string | undefined, initialState?: T): [T | undefined, (value: T) => void, connections: number] {
    const [state, setState] = useState(initialState);
    const stateRef = useRef(state);
    stateRef.current = state;

    const [_, setPeer] = useState<Peer>();
    const [connections, setConnections] = useState<DataConnection[]>([]);

    useEffect(() => {
        if (selfId === undefined) return;
        const newPeer = new Peer(selfId);

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
            setConnections([]);
        }
    }, [selfId]);

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

    return [state, handleSetState, connections.length];
}

export { useClientState, useHostState };
