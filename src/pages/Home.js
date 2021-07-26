import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <div className="d-flex flex-fill text-white centered">
            <Link to="/camera" className="btn btn-secondary">
                <span className="lead">Open Camera</span>
            </Link>
        </div>
    );
}