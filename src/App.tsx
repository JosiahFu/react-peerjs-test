import { useState } from 'react';
import Host from './Host';
import Client from './Client';

function App() {
    const [host, setHost] = useState(false);

    return (
        <>
            <input
                type='checkbox'
                checked={host}
                onChange={event => setHost(event.target.checked)}
            />
            {host ? <Host /> : <Client />}
        </>
    );
}

export default App;
