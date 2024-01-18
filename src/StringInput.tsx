import { useState } from 'react';

function StringInput({onSubmit, clear = false}: {onSubmit: (value: string) => void, clear?: boolean}) {
    const [value, setValue] = useState('');
    
    const handleSubmit = () => {
        if (clear) setValue('');
        onSubmit(value);
    }
    
    return <>
        <input value={value} onChange={event => setValue(event.target.value)} type='text' />
        <button onClick={handleSubmit}>Submit</button>
    </>
}

export default StringInput;
