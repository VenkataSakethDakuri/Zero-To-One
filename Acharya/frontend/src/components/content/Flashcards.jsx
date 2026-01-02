import { useState } from 'react';
import './Flashcards.css';

const Flashcards = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    if (!cards || cards.length === 0) {
        return (
            <div className="flashcards-empty">
                <div className="empty-icon">🎴</div>
                <h3>No Flashcards Available</h3>
                <p>Flashcards are being generated or not available for this subtopic.</p>
            </div>
        );
    }

    const flashcardData = parseFlashcards(cards);

    if (flashcardData.length === 0) {
        return (
            <div className="flashcards-empty">
                <div className="empty-icon">🎴</div>
                <h3>No Flashcards Available</h3>
                <p>Could not parse flashcard data.</p>
            </div>
        );
    }

    const currentCard = flashcardData[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % flashcardData.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + flashcardData.length) % flashcardData.length);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="flashcards">
            <div className="flashcards-progress">
                <span className="progress-text">
                    Card {currentIndex + 1} of {flashcardData.length}
                </span>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentIndex + 1) / flashcardData.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="flashcard-container">
                <div
                    className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                    onClick={handleFlip}
                >
                    <div className="flashcard-inner">
                        <div className="flashcard-front">
                            <span className="card-label">Question</span>
                            <p className="card-text">{currentCard.front}</p>
                            <span className="flip-hint">Click to flip</span>
                        </div>
                        <div className="flashcard-back">
                            <span className="card-label">Answer</span>
                            <p className="card-text">{currentCard.back}</p>
                            <span className="flip-hint">Click to flip back</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flashcard-controls">
                <button
                    className="control-btn"
                    onClick={handlePrev}
                    disabled={flashcardData.length <= 1}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Previous</span>
                </button>

                <button className="shuffle-btn" onClick={() => setIsFlipped(!isFlipped)}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12C21 12 16 3 12 3C8 3 3 12 3 12C3 12 8 21 12 21C16 21 21 12 21 12Z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Flip Card</span>
                </button>

                <button
                    className="control-btn"
                    onClick={handleNext}
                    disabled={flashcardData.length <= 1}
                >
                    <span>Next</span>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <div className="flashcard-dots">
                {flashcardData.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => {
                            setIsFlipped(false);
                            setCurrentIndex(index);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// Parse flashcards from string or array format
const parseFlashcards = (cards) => {
    if (Array.isArray(cards)) {
        return cards.map(card => ({
            front: card.question || card.front || card.q || 'Question',
            back: card.answer || card.back || card.a || 'Answer'
        }));
    }

    if (typeof cards === 'string') {
        try {
            const parsed = JSON.parse(cards);
            if (Array.isArray(parsed)) {
                return parsed.map(card => ({
                    front: card.question || card.front || card.q || 'Question',
                    back: card.answer || card.back || card.a || 'Answer'
                }));
            }
        } catch {
            // Try parsing line-by-line format
            const lines = cards.split('\n').filter(line => line.trim());
            const flashcards = [];

            for (let i = 0; i < lines.length; i += 2) {
                if (lines[i + 1]) {
                    flashcards.push({
                        front: lines[i].replace(/^Q:\s*|^Question:\s*/i, ''),
                        back: lines[i + 1].replace(/^A:\s*|^Answer:\s*/i, '')
                    });
                }
            }

            if (flashcards.length > 0) return flashcards;

            // Fallback: treat whole thing as one card
            return [{ front: cards, back: 'No answer provided' }];
        }
    }

    return [];
};

export default Flashcards;
