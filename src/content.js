import React from 'react';
import ReactDOM from 'react-dom';
import "./css/content.css";

function Main() {
    return <div></div>
}

const app = document.createElement('div');
app.id = "ActHub Extension Root";
document.body.appendChild(app);
ReactDOM.render(<Main />, app);