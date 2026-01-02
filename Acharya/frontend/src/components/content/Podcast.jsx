import { useState, useRef, useEffect } from 'react';
import './Podcast.css';

const Podcast = ({ content }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioError, setAudioError] = useState(false);
    const audioRef = useRef(null);

    const podcastData = parsePodcast(content);

    useEffect(() => {
        if (audioRef.current && podcastData.audioUrl) {
            const audio = audioRef.current;

            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
                setAudioError(false);
            };

            const handleTimeUpdate = () => {
                setCurrentTime(audio.currentTime);
            };

            const handleEnded = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };

            const handleError = () => {
                setAudioError(true);
                setIsPlaying(false);
            };

            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('error', handleError);

            return () => {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('error', handleError);
            };
        }
    }, [podcastData.audioUrl]);

    if (!content) {
        return (
            <div className="podcast-empty">
                <div className="empty-icon">🎙️</div>
                <h3>No Podcast Available</h3>
                <p>Podcast content is being generated or not available for this subtopic.</p>
            </div>
        );
    }

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => setAudioError(true));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e) => {
        const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="podcast">
            <div className="podcast-player">
                <div className="player-artwork">
                    <div className="artwork-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 9V15C19 17.7614 16.7614 20 14 20H10C7.23858 20 5 17.7614 5 15V9C5 6.23858 7.23858 4 10 4H14C16.7614 4 19 6.23858 19 9Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M15 11L12 14L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {isPlaying && (
                        <div className="sound-waves">
                            <span className="wave"></span>
                            <span className="wave"></span>
                            <span className="wave"></span>
                            <span className="wave"></span>
                        </div>
                    )}
                </div>

                <div className="player-content">
                    <div className="player-info">
                        <span className="player-label">Podcast Episode</span>
                        <h3 className="player-title">{podcastData.title || 'Topic Overview'}</h3>
                    </div>

                    {podcastData.audioUrl && !audioError ? (
                        <>
                            <audio ref={audioRef} src={podcastData.audioUrl} preload="metadata" />

                            <div className="player-controls">
                                <button className="play-btn" onClick={togglePlay}>
                                    {isPlaying ? (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                                            <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                                        </svg>
                                    )}
                                </button>

                                <div className="progress-container">
                                    <div className="progress-bar" onClick={handleSeek}>
                                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                                        <div className="progress-handle" style={{ left: `${progress}%` }} />
                                    </div>
                                    <div className="time-display">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-audio-message">
                            <p>{audioError ? '⚠️ Audio file not available.' : 'Read the transcript below.'}</p>
                        </div>
                    )}
                </div>
            </div>

            {podcastData.transcript && (
                <div className="podcast-transcript">
                    <div className="transcript-header">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <h4>Transcript</h4>
                    </div>
                    <div className="transcript-content">
                        {formatTranscript(podcastData.transcript)}
                    </div>
                </div>
            )}
        </div>
    );
};

// Format transcript with proper spacing and bold text
const formatTranscript = (transcript) => {
    if (!transcript) return null;

    // Split by speaker turns (look for "Speaker:" or "Name:" pattern at start of line)
    const lines = transcript.split('\n').filter(line => line.trim());

    return lines.map((line, index) => {
        // Check if line starts with a speaker name (e.g., "Alice:", "Bob:", "Speaker:")
        const speakerMatch = line.match(/^([A-Za-z\s]+):\s*(.*)$/);

        if (speakerMatch) {
            const speaker = speakerMatch[1];
            const text = speakerMatch[2];

            return (
                <div key={index} className="transcript-turn">
                    <span className="speaker-name">{speaker}:</span>
                    <span className="speaker-text">{formatBoldText(text)}</span>
                </div>
            );
        }

        // Regular line without speaker
        return (
            <p key={index} className="transcript-line">
                {formatBoldText(line)}
            </p>
        );
    });
};

// Convert **text** to bold elements
const formatBoldText = (text) => {
    if (!text) return text;

    // Split by **text** pattern
    const parts = text.split(/\*\*([^*]+)\*\*/g);

    if (parts.length === 1) return text; // No bold markers found

    return parts.map((part, index) => {
        // Every odd index is bold text (between **)
        if (index % 2 === 1) {
            return <strong key={index}>{part}</strong>;
        }
        return part;
    });
};

// Parse podcast content from various formats
const parsePodcast = (content) => {
    if (!content) return { title: '', audioUrl: '', transcript: '' };

    if (typeof content === 'object') {
        return {
            title: content.title || 'Topic Overview',
            audioUrl: content.audioUrl || content.url || content.audio || '',
            transcript: content.transcript || content.text || content.content || ''
        };
    }

    if (typeof content === 'string') {
        try {
            const parsed = JSON.parse(content);
            return {
                title: parsed.title || 'Topic Overview',
                audioUrl: parsed.audioUrl || parsed.url || parsed.audio || '',
                transcript: parsed.transcript || parsed.text || parsed.content || ''
            };
        } catch {
            // Treat as transcript text
            return {
                title: 'Topic Overview',
                audioUrl: '',
                transcript: content
            };
        }
    }

    return { title: '', audioUrl: '', transcript: '' };
};

export default Podcast;
