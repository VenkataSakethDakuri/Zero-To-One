import { useState, useEffect, useCallback } from 'react';
import './App.css';
import TopicInput from './components/TopicInput';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import { startGeneration, getGenerationStatus, healthCheck } from './services/api';

// Set to true to use mock data, false to use the real backend API
const USE_MOCK_DATA = false;

// Mock data generator for development/demo without backend
const generateMockData = (topic, subtopics) => {
  return subtopics.map((subtopic, index) => ({
    webContent: `# Understanding ${subtopic}\n\n${subtopic} is an important concept within the broader topic of ${topic}. This section provides a comprehensive overview of the key aspects you need to understand.\n\n## Key Concepts\n\n**Definition**: ${subtopic} refers to... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n## Why It Matters\n\nUnderstanding ${subtopic} is crucial because:\n\n- It forms the foundation for advanced concepts\n- It has practical applications in real-world scenarios\n- It connects to other related topics within ${topic}\n\n## Deep Dive\n\nLet's explore the intricacies of ${subtopic}. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n### Historical Context\n\nThe study of ${subtopic} has evolved significantly over time. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\n### Modern Applications\n\nToday, ${subtopic} finds applications in numerous fields including technology, science, and business. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    flashcards: [
      { question: `What is the primary definition of ${subtopic}?`, answer: `${subtopic} is a fundamental concept in ${topic} that encompasses the core principles and methodologies used in this field.` },
      { question: `Name three key components of ${subtopic}.`, answer: `The three key components are: 1) Theoretical framework, 2) Practical applications, and 3) Real-world implementations.` },
      { question: `How does ${subtopic} relate to ${topic}?`, answer: `${subtopic} is an integral part of ${topic}, serving as a building block for understanding more advanced concepts.` },
      { question: `What are the main benefits of understanding ${subtopic}?`, answer: `The main benefits include: improved analytical skills, better problem-solving abilities, and enhanced practical knowledge.` },
      { question: `Who pioneered the study of ${subtopic}?`, answer: `The study of ${subtopic} was pioneered by various researchers and practitioners who contributed to its development over time.` },
    ],
    quiz: [
      { question: `What is the primary purpose of ${subtopic}?`, options: ['To provide theoretical understanding', 'To enable practical applications', 'Both A and B', 'Neither A nor B'], correctIndex: 2 },
      { question: `Which field does NOT typically use ${subtopic}?`, options: ['Technology', 'Science', 'Underwater basket weaving', 'Business'], correctIndex: 2 },
      { question: `What is a core principle of ${subtopic}?`, options: ['Complexity', 'Simplicity and clarity', 'Randomness', 'Chaos'], correctIndex: 1 },
      { question: `How many main components does ${subtopic} have?`, options: ['One', 'Two', 'Three', 'Four'], correctIndex: 2 },
    ],
    podcast: {
      title: `Deep Dive: ${subtopic}`,
      transcript: `Welcome to our educational podcast on ${subtopic}!\n\nToday, we're going to explore one of the most fascinating aspects of ${topic}: ${subtopic}. Whether you're a beginner just starting out or someone looking to deepen your understanding, this episode has something valuable for you.\n\n[Music transition]\n\nLet's begin with the basics. ${subtopic} can be defined as... and it plays a crucial role in how we understand ${topic} as a whole.\n\nOne of the interesting things about ${subtopic} is its versatility. It can be applied across multiple domains and contexts, making it an incredibly valuable concept to master.\n\n[Sound effect: page turning]\n\nNow, let's look at some historical context. The development of ${subtopic} didn't happen overnight. It was the result of years of research, experimentation, and refinement by countless dedicated individuals.\n\n[Music transition]\n\nAs we wrap up today's episode, I want to leave you with some key takeaways:\n\n1. ${subtopic} is fundamental to understanding ${topic}\n2. Its applications are broad and far-reaching\n3. Continuous learning is key to mastery\n\nThank you for listening! Don't forget to review the flashcards and take the quiz to reinforce your learning.\n\n[Outro music]`
    },
    images: [
      { url: `https://picsum.photos/800/600?random=${index * 5 + 1}`, title: `${subtopic} Diagram 1`, description: 'Visual representation of key concepts' },
      { url: `https://picsum.photos/800/600?random=${index * 5 + 2}`, title: `${subtopic} Overview`, description: 'Comprehensive overview illustration' },
      { url: `https://picsum.photos/800/600?random=${index * 5 + 3}`, title: `${subtopic} in Action`, description: 'Real-world application example' },
    ]
  }));
};

function App() {
  const [appState, setAppState] = useState('input'); // 'input' | 'loading' | 'dashboard'
  const [topic, setTopic] = useState('');
  const [subtopics, setSubtopics] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // Still generating content
  const [loadingMessage, setLoadingMessage] = useState('');
  const [apiAvailable, setApiAvailable] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Check if API is available on mount
  useEffect(() => {
    const checkApi = async () => {
      if (!USE_MOCK_DATA) {
        const isAvailable = await healthCheck();
        setApiAvailable(isAvailable);
        if (!isAvailable) {
          console.warn('Backend API is not available. Using mock data.');
        }
      }
    };
    checkApi();
  }, []);

  // Poll for content updates when generating
  const pollForUpdates = useCallback(async (sid) => {
    if (!sid) return;

    try {
      const status = await getGenerationStatus(sid);

      // Update subtopics if available
      if (status.subtopics && status.subtopics.length > 0) {
        setSubtopics(status.subtopics);

        // Transition to dashboard as soon as we have subtopics
        if (appState === 'loading') {
          setAppState('dashboard');
        }
      }

      // Update content progressively
      if (status.content && status.content.length > 0) {
        setContentData(status.content);
      }

      // Update loading message
      if (status.progress) {
        setLoadingMessage(status.progress);
      }

      // Check if completed or error
      if (status.status === 'completed') {
        setIsGenerating(false);
        setIsLoading(false);
        return true; // Stop polling
      }

      if (status.status === 'error') {
        setError(status.error || 'Content generation failed');
        setIsGenerating(false);
        setIsLoading(false);
        return true; // Stop polling
      }

      return false; // Continue polling
    } catch (err) {
      console.error('Error polling for updates:', err);
      return false;
    }
  }, [appState]);

  // Polling effect
  useEffect(() => {
    if (!isGenerating || !sessionId) return;

    const pollInterval = setInterval(async () => {
      const shouldStop = await pollForUpdates(sessionId);
      if (shouldStop) {
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [isGenerating, sessionId, pollForUpdates]);

  const handleTopicSubmit = async (submittedTopic) => {
    setIsLoading(true);
    setIsGenerating(true);
    setTopic(submittedTopic);
    setAppState('loading');
    setError(null);
    setLoadingMessage(`Creating learning materials for "${submittedTopic}"...`);
    setSubtopics([]);
    setContentData([]);

    try {
      // Use real API if available and not in mock mode
      if (!USE_MOCK_DATA && apiAvailable) {
        // Start generation and get session ID
        const response = await startGeneration(submittedTopic);
        setSessionId(response.session_id);
        // Polling will be handled by the useEffect
      } else {
        // Use mock data for demo/development
        await new Promise(resolve => setTimeout(resolve, 3000));

        const mockSubtopics = [
          `Introduction to ${submittedTopic}`,
          `Core Concepts of ${submittedTopic}`,
          `Advanced ${submittedTopic} Techniques`,
          `${submittedTopic} Best Practices`,
          `Future of ${submittedTopic}`,
        ];

        const mockContentData = generateMockData(submittedTopic, mockSubtopics);

        setSubtopics(mockSubtopics);
        setContentData(mockContentData);
        setActiveTab(0);
        setIsLoading(false);
        setIsGenerating(false);
        setAppState('dashboard');
      }

    } catch (err) {
      console.error('Error generating content:', err);
      setError(err.message);
      setIsLoading(false);
      setIsGenerating(false);
      setAppState('input');
    }
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleNewTopic = () => {
    setAppState('input');
    setTopic('');
    setSubtopics([]);
    setContentData([]);
    setActiveTab(0);
    setSessionId(null);
    setIsGenerating(false);
    setError(null);
  };

  return (
    <>
      {appState === 'input' && (
        <>
          <TopicInput onSubmit={handleTopicSubmit} isLoading={isLoading} />
          {error && (
            <div style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(239, 68, 68, 0.9)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              maxWidth: '500px',
              textAlign: 'center'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          {!USE_MOCK_DATA && !apiAvailable && (
            <div style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(245, 158, 11, 0.9)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontSize: '0.875rem'
            }}>
              ⚠️ Backend API not available. Using demo mode.
            </div>
          )}
        </>
      )}
      {appState === 'loading' && (
        <LoadingScreen message={loadingMessage} />
      )}
      {appState === 'dashboard' && (
        <Dashboard
          topic={topic}
          subtopics={subtopics}
          contentData={contentData}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNewTopic={handleNewTopic}
          isGenerating={isGenerating}
          generatingMessage={loadingMessage}
        />
      )}
    </>
  );
}

export default App;
