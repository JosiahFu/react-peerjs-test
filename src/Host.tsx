import Chat from './Chat';
import { useHostState } from './usePeerState';

function Host() {
    const [messages, setMessages, id, connections] = useHostState<string[]>([]);

    return (
        <>
            <h1>Peerjs test</h1>
            <p>Id: {id ?? 'Loading...'}</p>
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
