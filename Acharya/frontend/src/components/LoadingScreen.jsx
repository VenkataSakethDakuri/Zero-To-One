import './LoadingScreen.css';

const LoadingScreen = ({ message = 'Generating your learning content...' }) => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="loading-logo">
                    <div className="logo-pulse">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <h2 className="loading-title gradient-text">Acharya</h2>
                <p className="loading-message">{message}</p>

                <div className="loading-progress">
                    <div className="progress-track">
                        <div className="progress-shimmer"></div>
                    </div>
                </div>

                <div className="loading-steps">
                    <div className="step active">
                        <span className="step-icon">📚</span>
                        <span className="step-text">Researching</span>
                    </div>
                    <div className="step">
                        <span className="step-icon">🎴</span>
                        <span className="step-text">Creating Flashcards</span>
                    </div>
                    <div className="step">
                        <span className="step-icon">🎯</span>
                        <span className="step-text">Building Quiz</span>
                    </div>
                    <div className="step">
                        <span className="step-icon">🎙️</span>
                        <span className="step-text">Generating Podcast</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
