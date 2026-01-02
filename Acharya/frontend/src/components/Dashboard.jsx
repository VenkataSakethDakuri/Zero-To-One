import './Dashboard.css';
import Sidebar from './Sidebar';
import ContentPanel from './ContentPanel';

const Dashboard = ({
    topic,
    subtopics,
    contentData,
    activeTab,
    onTabChange,
    onNewTopic,
    isGenerating,
    generatingMessage
}) => {
    const currentSubtopic = subtopics[activeTab] || '';
    const currentData = contentData[activeTab] || {};

    return (
        <div className="dashboard">
            <Sidebar
                topic={topic}
                subtopics={subtopics}
                activeTab={activeTab}
                onTabChange={onTabChange}
                onNewTopic={onNewTopic}
            />
            <div className="dashboard-main">
                {isGenerating && (
                    <div className="generating-banner">
                        <div className="generating-indicator">
                            <span className="pulse-dot"></span>
                            <span className="pulse-dot"></span>
                            <span className="pulse-dot"></span>
                        </div>
                        <span className="generating-text">
                            {generatingMessage || 'Generating content...'}
                        </span>
                    </div>
                )}
                <ContentPanel
                    subtopic={currentSubtopic}
                    data={currentData}
                    subtopicIndex={activeTab}
                    isGenerating={isGenerating}
                />
            </div>
        </div>
    );
};

export default Dashboard;
