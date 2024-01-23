import { useState } from 'react';
import Chat from './Chat';
import StringInput from './StringInput';
import { useClientState } from './usePeerState';

function Client() {
    const [id, setId] = useState<string>('');
    const [friend, setFriend] = useState<string>('');

    const [messages, setMessages, connected] = useClientState<string[]>(
        id || undefined,
        friend || undefined,
        []
    );

    return (
        <>
            <h1>Peerjs test</h1>
            <p>Id</p>
            <StringInput onSubmit={setId} />
            {connected ? (
                <p>Connected</p>
            ) : (
                <>
                    <p>Friend Id</p>
                    <StringInput onSubmit={setFriend} />
                </>
            )}
            <Chat id={id || ''} messages={messages} setMessages={setMessages} />
        </>
    );
}

export default Client;
