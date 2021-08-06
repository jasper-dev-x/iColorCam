import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <div className="d-flex flex-fill bgHome">
            <div className="d-flex flex-fill flex-column text-dark centered" style={{backgroundColor: 'rgba(255, 255, 255, 0.6)'}}>
                <div className="d-flex">
                    <h1 className="display-3 text-white fst-italic">i</h1><h1 className="display-3">ColorCam</h1>
                </div>
                <div className="d-flex flex-column text-center my-3 lead">
                    <h1 className="display-2">HEADS UP!</h1>
                    <span>You'll Be Asked For Camera Access.</span>
                    <span>You Must Screenshot To Save.</span>
                </div>
                <Link to="/camera" className="btn btn-dark">
                    <span className="lead">Open Camera</span>
                </Link>
            </div>
        </div>
    );
}