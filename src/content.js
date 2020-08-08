import React from 'react';
import ReactDOM from 'react-dom';
import "./css/content.css";
import usePort from './hooks/chrome/usePort';

function Main() {
    const port = usePort('ActHub')
    port.postMessage({message: 'Hello, backgroundJs! -- from contentJs'})
    return <div></div>
}

const app = document.createElement('div');
app.id = "act-hub-extension-root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);