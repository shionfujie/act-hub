import {useState} from 'react';

export default function useSwitch() {
    const [v, setState] = useState(false)
    return [v, () => setState(true), () => setState(false)]
}