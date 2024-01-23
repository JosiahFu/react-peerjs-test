import { useState } from 'react';
import Chat from './Chat';
import { useHostState } from './usePeerState';
import StringInput from './StringInput';

function Host() {
    const [id, setId] = useState<string>();
    const [messages, setMessages, realId, connections] = useHostState<string[]>(
        id,
        []
    );

    return (
        <>
            <h1>Peerjs test</h1>
            <p>Id: {realId ?? 'Loading...'}</p>
            <StringInput onSubmit={setId} />
            {connections ? (
                <p>{connections} connected</p>
            ) : (
                <p>None are connected</p>
            )}
            <Chat messages={messages} setMessages={setMessages} />
        </>
    );
}

export default Host;
