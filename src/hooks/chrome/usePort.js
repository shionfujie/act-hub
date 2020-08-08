/*global chrome*/

import {useEffect} from 'react';

export default function usePort(portName) {
    const port = chrome.runtime.connect({name: portName})
    useEffect(() => {
        return () => {
            port.disconnect()
        }
    })
    return port
}