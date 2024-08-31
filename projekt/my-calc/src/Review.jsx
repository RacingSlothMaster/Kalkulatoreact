import React, { useState } from 'react';
import clickSoundFile from './assets/click.mp3';
import StarRating from './StarRating';
import ThankYouMessage from './ThankYouMessage';

const clickSound = new Audio(clickSoundFile);

const Review = () => {
    const [isReviewing, setIsReviewing] = useState(false);
    const [rating, setRating] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);

    const triggerReview = () => {
        clickSound.play();
        setIsReviewing(true);
    };

    const closeReview = () => {
        clickSound.play();
        setIsReviewing(false);
    };

    const handleRating = (rating) => {
        setRating(rating);
        setIsReviewing(false);
        setShowThankYou(true);
    };

    const closeThankYouMessage = () => {
        setShowThankYou(false);
    };

    return (
        <div className='review-container'>
            <button className="review-button" onClick={triggerReview}>
                Oceń Kalkulatoreact
            </button>
            {isReviewing && (
                <StarRating onRate={handleRating} onClose={closeReview} />
            )}
            {showThankYou && (
                <ThankYouMessage rating={rating} onClose={closeThankYouMessage} />
            )}
        </div>
    );
};

export default Review;