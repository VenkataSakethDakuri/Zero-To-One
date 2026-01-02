import { useState } from 'react';
import './ContentPanel.css';
import WebContent from './content/WebContent';
import Flashcards from './content/Flashcards';
import Quiz from './content/Quiz';
import Podcast from './content/Podcast';
import ImageGallery from './content/ImageGallery';

const ContentPanel = ({ subtopic, data, subtopicIndex, isGenerating }) => {
    const [activeSection, setActiveSection] = useState('web');

    const sections = [
        { id: 'web', label: 'Web Content', icon: '📚' },
        { id: 'flashcards', label: 'Flashcards', icon: '🎴' },
        { id: 'quiz', label: 'Quiz', icon: '🎯' },
        { id: 'podcast', label: 'Podcast', icon: '🎙️' },
        { id: 'images', label: 'Images', icon: '🖼️' },
    ];

    // Check if content is available for each section
    const hasContent = {
        web: !!data?.webContent,
        flashcards: data?.flashcards && data.flashcards.length > 0,
        quiz: data?.quiz && data.quiz.length > 0,
        podcast: !!(data?.podcast?.transcript || data?.podcast?.audioUrl),
        images: data?.images && data.images.length > 0,
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'web':
                return <WebContent content={data?.webContent} isLoading={isGenerating && !hasContent.web} />;
            case 'flashcards':
                return <Flashcards cards={data?.flashcards} />;
            case 'quiz':
                return <Quiz questions={data?.quiz} />;
            case 'podcast':
                return <Podcast content={data?.podcast} />;
            case 'images':
                return <ImageGallery images={data?.images} />;
            default:
                return <WebContent content={data?.webContent} isLoading={isGenerating && !hasContent.web} />;
        }
    };

    return (
        <div className="content-panel">
            <header className="content-header">
                <div className="content-header-top">
                    <span className="subtopic-badge">Subtopic {subtopicIndex + 1}</span>
                    <h1 className="subtopic-title">{subtopic}</h1>
                </div>

                <nav className="content-tabs">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            className={`content-tab ${activeSection === section.id ? 'active' : ''} ${hasContent[section.id] ? 'has-content' : ''}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <span className="tab-icon">{section.icon}</span>
                            <span className="tab-label">{section.label}</span>
                            {isGenerating && !hasContent[section.id] && (
                                <span className="loading-dot"></span>
                            )}
                            {hasContent[section.id] && (
                                <span className="ready-check">✓</span>
                            )}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="content-main">
                {renderContent()}
            </main>
        </div>
    );
};

export default ContentPanel;
