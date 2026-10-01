import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useQuizStore } from './store/quizStore';
import { restoreQuizAttempt, startQuizTracking } from './lib/quizTracking';
import './index.css';

restoreQuizAttempt(useQuizStore);
const stopTracking = startQuizTracking(useQuizStore);
if (import.meta.hot) import.meta.hot.dispose(stopTracking);
createRoot(document.getElementById('root')).render(<App />);
