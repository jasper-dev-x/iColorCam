import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <div className="d-flex flex-fill flex-column text-white centered">
            <div>
                <span>F</span>
                <span>i</span>
                <span>n</span>
                <span>d</span>
                <span>H</span>
                <span>u</span>
                <span>e.</span>
            </div>
            <div className="d-flex flex-column text-center my-3 lead">
                <h1 className="display-2">HEADS UP!</h1>
                <span>You'll Be Asked For Camera Access.</span>
                <span>You Must Screenshot To Save.</span>
            </div>
            <Link to="/camera" className="btn btn-secondary">
                <span className="lead">Open Camera</span>
            </Link>
        </div>
    );
}