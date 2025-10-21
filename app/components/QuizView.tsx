'use client';

import { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizViewProps {
  questions: Question[];
  currentQuestionIndex: number;
  onAnswerSubmit: (answer: string) => void;
  onQuizComplete: (finalAnswer: string) => void;
}

export default function QuizView({
  questions,
  currentQuestionIndex,
  onAnswerSubmit,
  onQuizComplete,
}: QuizViewProps) {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answerError, setAnswerError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Auto-focus input when component mounts or question changes
  useEffect(() => {
    setCurrentAnswer('');
    setAnswerError('');
    setIsTransitioning(false);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    // Validate answer
    const trimmedAnswer = currentAnswer.trim();
    if (!trimmedAnswer) {
      setAnswerError('Please enter an answer');
      return;
    }

    setAnswerError('');
    setIsTransitioning(true);

    // Trigger transition animation
    setTimeout(() => {
      // If last question, complete quiz with the final answer
      if (isLastQuestion) {
        onQuizComplete(trimmedAnswer);
      } else {
        onAnswerSubmit(trimmedAnswer);
      }
    }, 150);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isTransitioning) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setCurrentAnswer('');
      setAnswerError('');
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Progress Indicator */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-warm-beige text-center">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-warm-gray rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-dusty-blue transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={currentQuestionIndex + 1}
              aria-valuemin={1}
              aria-valuemax={totalQuestions}
              aria-label={`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`bg-white/95 rounded-lg shadow-lg p-8 md:p-12 space-y-6 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Category Info */}
          <div className="flex gap-2 text-xs text-warm-beige">
            <span className="px-3 py-1 bg-warm-gray/30 rounded-full">
              {currentQuestion.category}
            </span>
            <span className="px-3 py-1 bg-warm-gray/30 rounded-full">
              {currentQuestion.subcategory}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answer Input */}
          <div className="space-y-2">
            <label htmlFor="answer" className="block text-sm font-medium text-charcoal">
              Your Answer
            </label>
            <input
              id="answer"
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your answer here..."
              className="w-full px-4 py-4 text-lg border-2 border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-dusty-blue focus:border-transparent text-charcoal min-h-[44px]"
              disabled={isTransitioning}
              autoFocus
              autoComplete="off"
              autoCapitalize="words"
            />
            
            {answerError && (
              <p className="text-soft-red text-sm mt-1">
                {answerError}
              </p>
            )}

            <p className="text-xs text-warm-beige mt-1">
              Press Enter to submit or Escape to clear
            </p>
          </div>

          {/* Navigation Button */}
          <button
            onClick={handleSubmit}
            disabled={isTransitioning || !currentAnswer.trim()}
            className="w-full bg-dusty-blue hover:bg-dusty-blue/90 disabled:bg-warm-gray disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md min-h-[44px]"
          >
            {isLastQuestion ? 'See Results' : 'Next'}
          </button>
        </div>

        {/* Remaining Questions Counter */}
        <p className="text-center text-sm text-warm-beige">
          {totalQuestions - currentQuestionIndex - 1} {totalQuestions - currentQuestionIndex - 1 === 1 ? 'question' : 'questions'} remaining
        </p>
      </div>
    </div>
  );
}
