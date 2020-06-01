import React from 'react';

const ErrorMessage = ({ msg }) => {
    return (
        <div className="lh-copy mt3">
            <p className="f5 red">{msg}</p>
        </div>
    );
}

export default ErrorMessage;