import React from 'react';

const ThankYouMessage = ({ rating, onClose }) => {
    return (
        <div className='thank-you-message-container'>
            <div className='thank-you-modal'>
                <p>Dziękujemy za ocenę: {rating} gwiazdek!</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default ThankYouMessage;