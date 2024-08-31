import React, { useState, useEffect, useRef } from 'react';
import starGif from './assets/star.gif';
import starStatic from './assets/star.png';

const StarRating = ({ onRate, onClose }) => {
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const ratingRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ratingRef.current && !ratingRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(-1);
    };

    const handleClick = async (index) => {
        setSelectedIndex(index);
        await submitRating(index + 1);
        onRate(index + 1);
    };

    const submitRating = async (rating) => {
        try {
            const response = await fetch('http://localhost/projekt/my-calc/src/submit_rating.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating }),
            });

            if (response.ok) {
                const data = await response.json();
            } else {
                console.error('Failed to submit rating');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='star-rating-container' ref={ratingRef}>
            <div className='rating-modal'>
                <h3>Wybierz ocenę:</h3><br />
                <div>
                    {[0, 1, 2, 3, 4].map((_, index) => (
                        <img
                            key={index}
                            src={hoveredIndex >= index || selectedIndex >= index ? starGif : starStatic}
                            alt='star'
                            className='star'
                            width='110px'
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StarRating;