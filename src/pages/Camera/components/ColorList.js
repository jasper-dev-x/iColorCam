import React, { useEffect, useState } from 'react';

export default function ColorList({ topColors, filterColor }) {
    useEffect(() => {
        if (topColors.length > 0)
            document.getElementById("revertBtn").classList.remove("d-none");
        else if (topColors.length === 0)
            document.getElementById("revertBtn").classList.add("d-none");
    }, [topColors.length]);

    return (
        <div className="d-flex flex-fill flex-column">
            <div id="revertBtn" className="d-flex flex-grow-1 centered fadeIn py-2 border border-dark border-3 d-none">
                <button className="btn btn-dark text-light" onClick={ () => filterColor() }>REVERT</button>
            </div>
            { topColors.map((item, key) => {
                let r = item.r;
                let g = item.g;
                let b = item.b;
                let backgroundColor = `rgb(${r},${g},${b})`;

                return (
                    <div key={ key } className="d-flex flex-grow-1 centered fadeIn py-2 border border-dark border-3" style={ { backgroundColor } }>
                        <button className="btn btn-dark text-light" onClick={ () => filterColor(item) }>{ `r: ${r}, g: ${g}, b: ${b}` }</button>
                    </div>
                );
            }) }
        </div>
    );
}