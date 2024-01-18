import StringInput from './StringInput';

function Chat({
    messages,
    setMessages,
    id,
}: {
    id: string;
    messages: string[];
    setMessages: (messages: string[]) => void;
}) {
    return (
        <>
            <div>
                {messages.map((e, i) => (
                    <p key={i}>{e}</p>
                ))}
            </div>
            <StringInput
                onSubmit={value =>
                    setMessages([...messages, `${id}: ${value}`])
                }
                clear
            />
        </>
    );
}

export default Chat;
