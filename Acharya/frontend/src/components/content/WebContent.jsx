import ReactMarkdown from 'react-markdown';
import './WebContent.css';

const WebContent = ({ content, isLoading }) => {
    if (!content && !isLoading) {
        return (
            <div className="web-content-empty">
                <div className="empty-icon">📚</div>
                <h3>No Web Content Available</h3>
                <p>Content is being generated or not available for this subtopic.</p>
            </div>
        );
    }

    // Show loading skeleton if loading
    if (isLoading && !content) {
        return (
            <div className="web-content">
                <article className="web-article">
                    <div className="loading-skeleton">
                        <div className="skeleton-line title"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line short"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                    </div>
                </article>
            </div>
        );
    }

    return (
        <div className="web-content">
            <article className="web-article">
                <ReactMarkdown
                    components={{
                        // Custom styling for markdown elements
                        h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
                        h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
                        h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
                        h4: ({ children }) => <h4 className="md-h4">{children}</h4>,
                        p: ({ children }) => <p className="md-paragraph">{children}</p>,
                        ul: ({ children }) => <ul className="md-list">{children}</ul>,
                        ol: ({ children }) => <ol className="md-list ordered">{children}</ol>,
                        li: ({ children }) => <li className="md-list-item">{children}</li>,
                        strong: ({ children }) => <strong className="md-bold">{children}</strong>,
                        em: ({ children }) => <em className="md-italic">{children}</em>,
                        blockquote: ({ children }) => <blockquote className="md-quote">{children}</blockquote>,
                        code: ({ inline, children }) =>
                            inline
                                ? <code className="md-inline-code">{children}</code>
                                : <pre className="md-code-block"><code>{children}</code></pre>,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="md-link">{children}</a>,
                    }}
                >
                    {content}
                </ReactMarkdown>
                {isLoading && (
                    <div className="streaming-indicator">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                )}
            </article>
        </div>
    );
};

export default WebContent;
