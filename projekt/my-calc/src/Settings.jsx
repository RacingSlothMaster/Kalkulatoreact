import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import Cookies from 'js-cookie';
import clickSoundFile from './assets/click.mp3';

const clickSound = new Audio(clickSoundFile);

const Settings = () => {
    const [color1, setColor1] = useState(Cookies.get('color1') || '#991A1A');
    const [color2, setColor2] = useState(Cookies.get('color2') || '#000000');
    const [fontSize, setFontSize] = useState(Cookies.get('fontSize') || '3rem');
    const [borderColor, setBorderColor] = useState(Cookies.get('borderColor') || '#C51616');
    const [backgroundColor, setBackgroundColor] = useState(Cookies.get('backgroundColor') || 'rgba(0, 0, 0, .75)');
    const [numberColor, setNumberColor] = useState(Cookies.get('numberColor') || '#D6C7C7');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSavedVisible, setIsSavedVisible] = useState(false);

    useEffect(() => {
        document.body.style = `background: linear-gradient(to right, ${color1}, ${color2})`;

        $('.calculator-grid > button').each(function () {
            $(this).css({
                fontSize: fontSize,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                color: numberColor
            });
        });

        const settingsContainer = document.querySelector('.settings-container');
        if (settingsContainer) {
            settingsContainer.style.color = numberColor;
            settingsContainer.style.backgroundColor = backgroundColor;
            settingsContainer.style.border = `3px solid ${borderColor}`;
        }

        const reviewButton = document.querySelector('.review-button');
        if (reviewButton) {
            reviewButton.style.color = numberColor;
            reviewButton.style.backgroundColor = backgroundColor;
            reviewButton.style.border = `3px solid ${borderColor}`;
        }

    }, [color1, color2, fontSize, borderColor, backgroundColor, numberColor]);

    const handleColor1Change = (e) => {
        setColor1(e.target.value);
    };

    const handleColor2Change = (e) => {
        setColor2(e.target.value);
    };

    const handleFontSizeChange = (size) => {
        clickSound.play();
        setFontSize(`${size}rem`);
    };

    const handleBorderColorChange = (e) => {
        const val = e.target.value;
        setBorderColor(val);
    };

    const handleButtonBackgroundColorChange = (e) => {
        setBackgroundColor(e.target.value);
    };

    const handleNumberColorChange = (e) => {
        setNumberColor(e.target.value);
    };

    const toggleExpansion = () => {
        clickSound.play();
        setIsExpanded(!isExpanded);
    };

    const saveCalcLayout = () => {
        clickSound.play();
        Cookies.set('color1', color1, { expires: 365 });
        Cookies.set('color2', color2, { expires: 365 });
        Cookies.set('fontSize', fontSize, { expires: 365 });
        Cookies.set('borderColor', borderColor, { expires: 365 });
        Cookies.set('backgroundColor', backgroundColor, { expires: 365 });
        Cookies.set('numberColor', numberColor, { expires: 365 });

        setIsSavedVisible(true);
        setTimeout(() => setIsSavedVisible(false), 1000);
    };

    const resetDefaults = () => {
        clickSound.play();

        Cookies.remove('color1');
        Cookies.remove('color2');
        Cookies.remove('fontSize');
        Cookies.remove('borderColor');
        Cookies.remove('backgroundColor');
        Cookies.remove('numberColor');

        window.location.reload();
    };

    return (
        <div className={`settings-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="header">
                <h2 style={{ marginTop: "0", marginBottom: "0" }}>Ustawienia</h2>
                <button className="toggle-button" onClick={toggleExpansion}>
                    {isExpanded ? '↑' : '↓'}
                </button>
            </div>

            {isExpanded && (
                <div className="settings-content">
                    <div>
                        <label htmlFor="color1Picker">Kolor lewej strony tła witryny:</label>
                        <input
                            type="color"
                            id="color1Picker"
                            value={color1}
                            onChange={handleColor1Change}
                        />
                    </div><br />
                    <div>
                        <label htmlFor="color2Picker">Kolor prawej strony tła witryny:</label>
                        <input
                            type="color"
                            id="color2Picker"
                            value={color2}
                            onChange={handleColor2Change}
                        />
                    </div><br />
                    <div>
                        <label>Rozmiar cyfr na klawiaturze:</label><br />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['1', '2', '3', '4', '5'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => handleFontSizeChange(size)}
                                    className="font-size-button"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div><br />
                    <div>
                        <label htmlFor="borderColor">Obramowanie przycisków:</label>
                        <input
                            type="color"
                            id="borderColor"
                            value={borderColor}
                            onChange={handleBorderColorChange}
                        />
                    </div><br />
                    <div>
                        <label htmlFor="buttonBackgroundColor">Tło przycisków:</label>
                        <input
                            type="color"
                            id="buttonBackgroundColor"
                            value={backgroundColor}
                            onChange={handleButtonBackgroundColorChange}
                        />
                    </div><br />
                    <div>
                        <label htmlFor="numberColorPicker">Kolor cyfr na klawiaturze:</label>
                        <input
                            type="color"
                            id="numberColorPicker"
                            value={numberColor}
                            onChange={handleNumberColorChange}
                        />
                    </div><br />
                    <button className="save-button" onClick={saveCalcLayout}>
                        Zapisz
                    </button>
                    <button className="reset-button" onClick={resetDefaults}>
                        Przywróć
                    </button>
                    {isSavedVisible && <p className="saved-message">Zapisano</p>}
                </div>
            )}
        </div>
    );
};

export default Settings;