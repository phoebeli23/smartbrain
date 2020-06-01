import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {
    const display = boxes.map(box => 
        <div id={box.topRow} className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
    );
    if (imageUrl) {
        return (
            <div className='center ma'>
                <div className='absolute mt2'>
                    <img id='inputImage' src={imageUrl} width='500px' height='auto' alt='img'/>
                    {display}
                </div>
            </div>
        )
    } else {
        return <div/>;
    }
}

export default FaceRecognition;