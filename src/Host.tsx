import { useState } from 'react';
import Chat from './Chat';
import StringInput from './StringInput';
import { useHostState } from './usePeerState';

function Host() {
    const [id, setId] = useState<string>('');

    const [messages, setMessages, connections] = useHostState<string[]>(
        id || undefined,
        []
    );

    return (
        <>
            <h1>Peerjs test</h1>
            <p>Id</p>
            <StringInput onSubmit={setId} />
            {connections ? (
                <p>{connections} connected</p>
            ) : (
                <p>None are connected</p>
            )}
            <Chat id={id || ''} messages={messages} setMessages={setMessages} />
        </>
    );
}

export default Host;
