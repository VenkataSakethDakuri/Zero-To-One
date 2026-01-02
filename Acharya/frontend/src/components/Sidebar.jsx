import './Sidebar.css';

const Sidebar = ({ subtopics, activeTab, onTabChange, topic, onNewTopic }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <h2 className="sidebar-title gradient-text">Acharya</h2>
            </div>

            <div className="topic-badge">
                <span className="topic-label">Learning</span>
                <span className="topic-name">{topic}</span>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-section-title">Subtopics</span>
                    <ul className="nav-list">
                        {subtopics.map((subtopic, index) => (
                            <li key={index}>
                                <button
                                    className={`nav-item ${activeTab === index ? 'active' : ''}`}
                                    onClick={() => onTabChange(index)}
                                >
                                    <span className="nav-item-number">{index + 1}</span>
                                    <span className="nav-item-text">{subtopic}</span>
                                    {activeTab === index && (
                                        <span className="nav-item-indicator"></span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            <div className="sidebar-footer">
                <button className="back-btn" onClick={onNewTopic}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>New Topic</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
