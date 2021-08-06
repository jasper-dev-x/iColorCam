import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ColorList from './components/ColorList';
import { rgbStringify } from './services';

export default function Camera() {
    var colorSet = new Set();
    var colorMap = new Map();
    var colorList = [];
    var localTopColors = { R: [], G: [], B: [], X: [] };
    const [topColors, setTopColors] = useState({ R: [], G: [], B: [], X: [] });
    const [CAMSTREAM, setCAMSTREAM] = useState();
    const [IMAGEDATA, setIMAGEDATA] = useState();
    const video = useRef();
    const canvas = useRef();
    const reset = useRef();
    const capture = useRef();
    const XY = window.screen.availHeight > window.screen.availWidth ? window.screen.availWidth : (window.screen.availHeight / 2);

    useEffect(() => {
        startCam();
    }, []);

    const startCam = () => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", aspectRatio: 1 } })
            .then((stream) => {
                // This makes 'stream' local
                setCAMSTREAM(stream);
                const camView = video.current;
                camView.srcObject = stream;
                camView.play();
            });
    };

    const stopCam = () => {
        const camView = video.current;
        camView.pause();
        camView.src = '';
        // This line removes the cam hardware from page access
        CAMSTREAM.getTracks()[0].stop();
    };

    const loadCanvas = async () => {
        // VIDEO => CANVAS DISPLAY 
        video.current.classList.add("d-none");
        capture.current.classList.add("d-none");
        canvas.current.classList.remove("d-none");
        reset.current.classList.remove("d-none");

        // LOADING VIDEO FRAME DATA INTO CANVAS
        const ctx = await canvas.current.getContext("2d");
        ctx.drawImage(video.current, 0, 0, XY, XY);

        // GETTING IMAGE DATA FROM CANVAS CONTEXT
        var imgData = await ctx.getImageData(0, 0, XY, XY);
        setIMAGEDATA(imgData);

        // TURN OFF CAM
        await stopCam();

        // LOOPING THRU IMAGE DATA AND CONVERTING INTO STRING FORMAT
        for (var x = 0;x < imgData.data.length;x += 4) {
            const r = imgData.data[x];
            const g = imgData.data[x + 1];
            const b = imgData.data[x + 2];
            // const a = imgData.data[x + 3];

            // FILTERING OUT MONOCHROME COLORS
            let colorDiff = 20;

            if ((r - g > colorDiff || g - r > colorDiff) || (r - b > colorDiff || b - r > colorDiff) || (g - b > colorDiff || b - g > colorDiff)) {
                if (r + g + b > 100 && r + g + b < 700) {
                    let pixelColor = `${rgbStringify(r)}${rgbStringify(g)}${rgbStringify(b)}`;
                    colorSet.add(pixelColor);
                    colorList.push(pixelColor);
                }
            }
        }
        // INIT COLOR FREQUENCY MAP WITH '1' DEFAULT
        colorSet.forEach((color) => {
            colorMap.set(color, 1);
        });

        // TALLY COLOR FREQUENCY TO MAP
        colorList.forEach((color) => {
            colorMap.set(color, colorMap.get(color) + 1);
        });

        // GETTING TOP COLORS
        getTopColors();

        // 60 Frames/Sec
        // setInterval(() => {

        // }, 1000 / 60);
    };


    const resetCanvas = async () => {
        await startCam();
        await setTopColors(localTopColors);
        const ctx = await canvas.current.getContext("2d");
        ctx.clearRect(0, 0, XY, XY);
        canvas.current.classList.add("d-none");
        reset.current.classList.add("d-none");
        video.current.classList.remove("d-none");
        capture.current.classList.remove("d-none");
    };

    const getTopColors = async () => {
        let topOfList = Array.from(colorMap.values()).sort((a, b) => b - a).slice(0, 200);
        let nextList = colorMap.keys();
        await nextList.next();

        colorMap.forEach(async (value, key) => {
            let nextPixel = nextList.next().value;

            let z = topOfList.find((top) => top === value);
            if (z) {
                let r = parseInt(key.slice(0, 3));
                let g = parseInt(key.slice(3, 6));
                let b = parseInt(key.slice(6, 9));
                let rNxt = parseInt(nextPixel.slice(0, 3));
                let gNxt = parseInt(nextPixel.slice(3, 6));
                let bNxt = parseInt(nextPixel.slice(6, 9));

                const rgbX = 3;

                if (Math.abs(r - rNxt) > rgbX || Math.abs(g - gNxt) > rgbX || Math.abs(b - bNxt) > rgbX) {
                    if (r > g + rgbX && r > b + rgbX)
                        await localTopColors.R.push({ r, g, b });
                    else if (g > r + rgbX && g > b + rgbX)
                        await localTopColors.G.push({ r, g, b });
                    else if (b > g + rgbX && b > r + rgbX)
                        await localTopColors.B.push({ r, g, b });
                    else
                        await localTopColors.X.push({ r, g, b });
                }
            }
        });
        await setTopColors({ R: [...localTopColors.R], G: [...localTopColors.G], B: [...localTopColors.B], X: [...localTopColors.X] });
        localTopColors = { R: [], G: [], B: [], X: [] };
    };

    const filterColor = async (color) => {
        const ctx = await canvas.current.getContext("2d");
        var imgData = new ImageData(XY, XY);

        if (!color) {
            return await ctx.putImageData(IMAGEDATA, 0, 0);
        }

        for (let x = 0;x < IMAGEDATA.data.length;x += 4) {
            let r = IMAGEDATA.data[x];
            let g = IMAGEDATA.data[x + 1];
            let b = IMAGEDATA.data[x + 2];
            let a = 255;

            // FILTER COLORS THAT ARE WITHIN 10 FROM CHOSEN COLOR
            let margin = 10;
            let offset = 50;
            let pixelRow = XY * 4;

            // x < (XY * XY)-> Covers 25% of rows top to bottom fully
            // x % pixelRow < (pixelRow * .25) -> Covers first 25% of columns left to right fully
            // SHOULD cover top left 1/8 of cam view
            if (x % pixelRow < (pixelRow * .25) && x < (XY * XY)) {
                imgData.data[x] = color.r;
                imgData.data[x + 1] = color.g;
                imgData.data[x + 2] = color.b;
                imgData.data[x + 3] = a;
            } else if ((r > color.r - margin && r < color.r + margin) && (g > color.g - margin && g < color.g + margin) && (b > color.b - margin && b < color.b + margin)) {
                imgData.data[x] = color.r;
                imgData.data[x + 1] = color.g;
                imgData.data[x + 2] = color.b;
                imgData.data[x + 3] = a;
            }
            else if (r > g && r > b) {
                imgData.data[x] = r + offset < 255 ? r + offset : 255;
                imgData.data[x + 1] = r + offset < 255 ? r + offset : 255;
                imgData.data[x + 2] = r + offset < 255 ? r + offset : 255;
                imgData.data[x + 3] = a;
            } else if (g > r && g > b) {
                imgData.data[x] = g + offset < 255 ? g + offset : 255;
                imgData.data[x + 1] = g + offset < 255 ? g + offset : 255;
                imgData.data[x + 2] = g + offset < 255 ? g + offset : 255;
                imgData.data[x + 3] = a;
            } else if (b > r && b > g) {
                imgData.data[x] = b + offset < 255 ? b + offset : 255;
                imgData.data[x + 1] = b + offset < 255 ? b + offset : 255;
                imgData.data[x + 2] = b + offset < 255 ? b + offset : 255;
                imgData.data[x + 3] = a;
            } else {
                imgData.data[x] = r + offset < 255 ? r + offset : 255;
                imgData.data[x + 1] = g + offset < 255 ? g + offset : 255;
                imgData.data[x + 2] = b + offset < 255 ? b + offset : 255;
                imgData.data[x + 3] = a;
            }
        };
        // PAINT FILTERED OUT COLORS
        await ctx.putImageData(imgData, 0, 0);
    };

    const borderRadius = 10;
    return (
        <div className="d-flex flex-fill flex-column align-items-center justify-content-between">

            {/* CAMERA VIEW */ }
            <div className="card shadow-lg" style={{borderRadius}}>
                <canvas ref={ canvas } width={ XY } height={ XY } className="d-none" style={{borderRadius}} />
                <video ref={ video } width={ XY } height={ XY } style={{borderRadius}}/>
            </div>

            {/* TOP COLORS */ }
            <div className="d-flex flex-fill">
                <ColorList topColors={ topColors } filterColor={ filterColor } stopCam={ stopCam } capture={ capture } loadCanvas={ loadCanvas } reset={ reset } resetCanvas={ resetCanvas } />
            </div>

            {/* <button className="btn btn-info" onClick={ () => console.log(topColors) }>LOG</button> */ }

        </div>
    );
}