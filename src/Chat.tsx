import { useState } from 'react';
import StringInput from './StringInput';

function Chat({
    messages,
    setMessages,
}: {
    messages: string[];
    setMessages: (messages: string[]) => void;
}) {
    const [name, setName] = useState('');

    return (
        <>
            <h2>Name</h2>
            <StringInput onSubmit={setName} />

            <div>
                {messages.map((e, i) => (
                    <p key={i}>{e}</p>
                ))}
            </div>
            <StringInput
                onSubmit={value =>
                    setMessages([...messages, `${name}: ${value}`])
                }
                clear
            />
        </>
    );
}

export default Chat;
