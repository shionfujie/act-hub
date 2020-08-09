import {useState} from 'react';

export default function useSwitch(initial=false) {
    const [v, setState] = useState(initial)
    return [v, () => setState(true), () => setState(false)]
}