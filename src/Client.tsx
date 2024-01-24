import { useState } from 'react';
import Chat from './Chat';
import StringInput from './StringInput';
import { useClientState } from '@tater-archives/react-use-peer-state';

function Client() {
    const [friend, setFriend] = useState<string>('');

    const [messages, setMessages, connected] = useClientState<string[]>(
        friend || undefined,
        []
    );

    return (
        <>
            <h1>Peerjs test</h1>
            {connected ? (
                <p>Connected</p>
            ) : (
                <>
                    <p>Friend Id</p>
                    <StringInput onSubmit={setFriend} />
                </>
            )}
            <Chat messages={messages} setMessages={setMessages} />
        </>
    );
}

export default Client;
