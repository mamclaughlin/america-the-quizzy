'use client';

import { useState } from 'react';
import ConfigurationView from './components/ConfigurationView';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import { AppState, QuizConfig, QuestionWithUserAnswer, isApiError } from './types';

// LocalStorage key for tracking asked questions
const ASKED_QUESTIONS_KEY = 'america-quizzy-asked-questions';

// Load asked questions from localStorage
function loadAskedQuestions(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(ASKED_QUESTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save asked questions to localStorage
function saveAskedQuestions(questionIds: string[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ASKED_QUESTIONS_KEY, JSON.stringify(questionIds));
  } catch (error) {
    console.warn('Failed to save asked questions to localStorage:', error);
  }
}

// Add new question IDs to the asked questions list
function addAskedQuestions(newQuestionIds: string[]): void {
  const existing = loadAskedQuestions();
  const updated = [...new Set([...existing, ...newQuestionIds])]; // Remove duplicates
  saveAskedQuestions(updated);
}

export default function QuizOrchestrator() {
  const [state, setState] = useState<AppState>({
    view: 'configuration',
    config: null,
    questions: null,
    answers: [],
    currentQuestionIndex: 0,
    results: null,
    loading: false,
    error: null,
  });

  // Handler for starting quiz (configuration complete)
  const handleStartQuiz = async (config: QuizConfig) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Load previously asked questions from localStorage
      const askedQuestions = loadAskedQuestions();
      
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          asked_questions: askedQuestions,
        }),
      });

      const data = await response.json();

      if (!response.ok || isApiError(data)) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      setState(prev => ({
        ...prev,
        view: 'quiz',
        config,
        questions: data.questions,
        answers: [],
        currentQuestionIndex: 0,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  // Handler for answer submission
  const handleAnswerSubmit = (answer: string) => {
    setState(prev => ({
      ...prev,
      answers: [...prev.answers, answer],
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));
  };

  // Handler for quiz completion (last answer submitted)
  const handleQuizComplete = async (finalAnswer: string) => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      // Build questions with user answers (including the final answer just submitted)
      const allAnswers = [...state.answers, finalAnswer];
      const questionsWithAnswers: QuestionWithUserAnswer[] = state.questions!.map((q, index) => ({
        ...q,
        user_answer: allAnswers[index],
      }));

      const response = await fetch('/api/grade-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: questionsWithAnswers }),
      });

      const data = await response.json();

      if (!response.ok || isApiError(data)) {
        throw new Error(data.error || 'Failed to grade answers');
      }

      // Save the question IDs to localStorage for future avoidance
      const questionIds = state.questions!
        .map(q => q.id)
        .filter((id): id is string => id !== undefined);
      
      if (questionIds.length > 0) {
        addAskedQuestions(questionIds);
      }

      setState(prev => ({
        ...prev,
        view: 'results',
        results: data,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  // Handler for quiz restart
  const handleRestart = () => {
    setState(prev => ({
      view: 'configuration',
      config: { ...prev.config!, category: 'Any', subcategory: 'Any' }, // Keep question count, reset categories
      questions: null,
      answers: [],
      currentQuestionIndex: 0,
      results: null,
      loading: false,
      error: null,
    }));
  };

  // Render appropriate view
  return (
    <div className="transition-opacity duration-300">
      {state.view === 'configuration' && (
        <ConfigurationView
          onStartQuiz={handleStartQuiz}
          loading={state.loading}
          error={state.error}
        />
      )}

      {state.view === 'quiz' && state.questions && (
        <QuizView
          questions={state.questions}
          currentQuestionIndex={state.currentQuestionIndex}
          onAnswerSubmit={handleAnswerSubmit}
          onQuizComplete={handleQuizComplete}
        />
      )}

      {state.view === 'results' && state.results && (
        <ResultsView
          results={state.results}
          onRestart={handleRestart}
          loading={state.loading}
        />
      )}
    </div>
  );
}
