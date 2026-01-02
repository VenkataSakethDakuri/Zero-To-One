import { useState } from 'react';
import './TopicInput.css';

const TopicInput = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim());
    }
  };

  return (
    <div className="topic-input-container">
      <div className="topic-input-wrapper animate-slideUp">
        <div className="logo-section">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="app-title">
            <span className="gradient-text">Acharya</span>
          </h1>
          <p className="app-tagline">Your AI-Powered Learning Companion</p>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-group">
            <div className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to learn today?"
              className="topic-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={!topic.trim() || isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>Explore</span>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="features-preview">
          <div className="feature-chip">
            <span className="feature-icon">📚</span>
            <span>Web Content</span>
          </div>
          <div className="feature-chip">
            <span className="feature-icon">🎴</span>
            <span>Flashcards</span>
          </div>
          <div className="feature-chip">
            <span className="feature-icon">🎯</span>
            <span>Quizzes</span>
          </div>
          <div className="feature-chip">
            <span className="feature-icon">🎙️</span>
            <span>Podcasts</span>
          </div>
          <div className="feature-chip">
            <span className="feature-icon">🖼️</span>
            <span>Images</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicInput;
