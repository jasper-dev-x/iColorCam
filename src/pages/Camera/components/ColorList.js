import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ColorList({ topColors, filterColor, stopCam, capture, loadCanvas, reset, resetCanvas }) {
    const XY = window.screen.availHeight > window.screen.availWidth ? window.screen.availWidth : (window.screen.availHeight / 2);

    useEffect(() => {
        if (topColors.R.length !== 0 || topColors.G.length !== 0 || topColors.B.length !== 0) {
            document.getElementById('revertBtn').classList.remove('d-none');
        } else {
            document.getElementById('revertBtn').classList.add('d-none');
        }
    }, [topColors]);

    return (
        <div className="d-flex flex-column justify-content-center" >
            <div className="d-flex flex-fill justify-content-between align-items-center">
                <Link to="/" className="btn btn-secondary" onClick={ () => stopCam() }>
                    <span>Back</span>
                </Link>
                <div id="revertBtn" className="d-flex centered fadeIn d-none my-3">
                    <button className="btn btn-dark" onClick={ () => filterColor() }>Return Color</button>
                </div>
                <button ref={ capture } className="btn btn-primary" onClick={ () => loadCanvas() }> Capture </button>
                <button ref={ reset } className="btn btn-danger d-none" onClick={ () => resetCanvas() }> Start Over </button>
            </div>

            <div className="d-flex flex-column overflow-auto" style={ { width: XY - 10, borderRadius: 10, height: '32vh' } }>
                <div className="d-flex flex-column px-2 bg-danger">
                    { topColors.R.map((item, key) => {
                        let r = item.r;
                        let g = item.g;
                        let b = item.b;
                        let backgroundColor = `rgb(${r},${g},${b})`;

                        return (
                            <div key={ key } className="d-flex centered fadeIn py-2 border border-dark border-3" style={ { backgroundColor } }>
                                <button className="btn btn-dark text-light" onClick={ () => filterColor({ r, g, b }) }>{ `r: ${r}, g: ${g}, b: ${b}` }</button>
                            </div>
                        );
                    }) }
                </div>
                <div className="d-flex flex-column px-2 bg-success">
                    { topColors.G.map((item, key) => {
                        let r = item.r;
                        let g = item.g;
                        let b = item.b;
                        let backgroundColor = `rgb(${r},${g},${b})`;

                        return (
                            <div key={ key } className="d-flex centered fadeIn py-2 border border-dark border-3" style={ { backgroundColor } }>
                                <button className="btn btn-dark text-light" onClick={ () => filterColor({ r, g, b }) }>{ `r: ${r}, g: ${g}, b: ${b}` }</button>
                            </div>
                        );
                    }) }
                </div>
                <div className="d-flex flex-column px-2 bg-primary">
                    { topColors.B.map((item, key) => {
                        let r = item.r;
                        let g = item.g;
                        let b = item.b;
                        let backgroundColor = `rgb(${r},${g},${b})`;

                        return (
                            <div key={ key } className="d-flex centered fadeIn py-2 border border-dark border-3" style={ { backgroundColor } }>
                                <button className="btn btn-dark text-light" onClick={ () => filterColor({ r, g, b }) }>{ `r: ${r}, g: ${g}, b: ${b}` }</button>
                            </div>
                        );
                    }) }
                </div>
                <div className="d-flex flex-column px-2 bg-light">
                    { topColors.X.map((item, key) => {
                        let r = item.r;
                        let g = item.g;
                        let b = item.b;
                        let backgroundColor = `rgb(${r},${g},${b})`;

                        return (
                            <div key={ key } className="d-flex centered fadeIn py-2 border border-dark border-3" style={ { backgroundColor } }>
                                <button className="btn btn-dark text-light" onClick={ () => filterColor({ r, g, b }) }>{ `r: ${r}, g: ${g}, b: ${b}` }</button>
                            </div>
                        );
                    }) }
                </div>
            </div >
        </div>
    );
}