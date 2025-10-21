'use client';

import { GradingResult, calculateScore } from '../types';

interface ResultsViewProps {
  results: GradingResult;
  onRestart: () => void;
  loading: boolean;
}

export default function ResultsView({ results, onRestart, loading }: ResultsViewProps) {
  const { total, correct, incorrect, percentage } = calculateScore(results);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Score Summary */}
        <div className="bg-white/95 rounded-lg shadow-lg p-8 text-center space-y-4" role="region" aria-label="Quiz results summary">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal">
            Quiz Complete!
          </h1>
          
          <div className="flex items-center justify-center gap-2" aria-label={`You scored ${correct} out of ${total} questions correctly`}>
            <div className="text-6xl md:text-7xl font-bold text-dusty-blue">
              {correct}
            </div>
            <div className="text-3xl md:text-4xl text-warm-beige">
              / {total}
            </div>
          </div>

          <p className="text-xl text-charcoal">
            {percentage}% Correct
          </p>

          <div className="flex justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-sage-green/20 text-sage-green rounded-full font-medium">
              ✓ {correct} Correct
            </span>
            {incorrect > 0 && (
              <span className="px-4 py-2 bg-soft-red/20 text-soft-red rounded-full font-medium">
                ✗ {incorrect} Incorrect
              </span>
            )}
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-4" role="region" aria-label="Answer review">
          <h2 className="text-2xl font-bold text-charcoal">
            Review Your Answers
          </h2>

          {results.questions.map((q, index) => {
            const isCorrect = q.result === 'correct';

            return (
              <article
                key={index}
                className={`bg-white/95 rounded-lg shadow-md p-6 space-y-3 border-l-4 ${
                  isCorrect ? 'border-sage-green' : 'border-soft-red'
                }`}
                aria-label={`Question ${index + 1} - ${isCorrect ? 'Answered correctly' : 'Answered incorrectly'}`}
              >
                {/* Question Number & Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-warm-beige">
                      Question {index + 1}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isCorrect
                          ? 'bg-sage-green/20 text-sage-green'
                          : 'bg-soft-red/20 text-soft-red'
                      }`}
                    >
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 text-xs text-warm-beige">
                    <span className="px-2 py-1 bg-warm-gray/30 rounded">
                      {q.category}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-lg font-semibold text-charcoal">
                  {q.question}
                </p>

                {/* User's Answer */}
                <div>
                  <p className="text-sm text-warm-beige mb-1">Your Answer:</p>
                  <p
                    className={`text-base font-medium ${
                      isCorrect ? 'text-sage-green' : 'text-soft-red'
                    }`}
                  >
                    {q.user_answer}
                  </p>
                </div>

                {/* Correct Answers */}
                <div>
                  <p className="text-sm text-warm-beige mb-1">
                    Correct Answer{q.answers.length > 1 ? 's' : ''}:
                  </p>
                  <div className="space-y-1">
                    {q.answers.map((answer, ansIndex) => (
                      <p
                        key={ansIndex}
                        className={`text-base font-medium ${
                          q.matched_answer === answer
                            ? 'text-sage-green'
                            : 'text-charcoal'
                        }`}
                      >
                        {answer}
                        {q.matched_answer === answer && ' ✓'}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Restart Button */}
        <div className="sticky bottom-0 pb-8 pt-4">
          <button
            onClick={onRestart}
            disabled={loading}
            className="w-full bg-dusty-blue hover:bg-dusty-blue/90 disabled:bg-warm-gray disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg min-h-[44px]"
          >
            {loading ? 'Restarting...' : 'Restart Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}
