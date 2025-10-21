'use client';

import { useState } from 'react';
import { QuizConfig } from '../types';
import { CATEGORIES, SUBCATEGORIES, MIN_QUESTIONS, MAX_QUESTIONS, DEFAULT_QUESTIONS } from '../types/constants';

interface ConfigurationViewProps {
  onStartQuiz: (config: QuizConfig) => void;
  loading: boolean;
  error: string | null;
}

export default function ConfigurationView({ onStartQuiz, loading, error }: ConfigurationViewProps) {
  const [numQuestions, setNumQuestions] = useState<number>(DEFAULT_QUESTIONS);
  const [category, setCategory] = useState<string>('Any');
  const [subcategory, setSubcategory] = useState<string>('Any');
  const [validationError, setValidationError] = useState<string>('');

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSubcategory('Any'); // Reset subcategory when category changes
  };

  const validateAndSubmit = () => {
    // Validation
    if (numQuestions < MIN_QUESTIONS || numQuestions > MAX_QUESTIONS) {
      setValidationError(`Number of questions must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}`);
      return;
    }

    if (!category || category.trim() === '') {
      setValidationError('Please select a category');
      return;
    }

    if (!subcategory || subcategory.trim() === '') {
      setValidationError('Please select a subcategory');
      return;
    }

    setValidationError('');
    
    const config: QuizConfig = {
      number_of_questions: numQuestions,
      category,
      subcategory,
    };
    
    onStartQuiz(config);
  };

  const subcategoryOptions = SUBCATEGORIES[category] || ['Any'];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-2">
            America the Quizzy
          </h1>
          <p className="text-warm-beige text-lg md:text-xl">
            US Citizenship Test Practice
          </p>
        </div>

        {/* Form */}
        <form
          className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            validateAndSubmit();
          }}
          aria-label="Quiz configuration form"
        >
          {/* Number of Questions */}
          <div>
            <label htmlFor="numQuestions" className="block text-sm font-medium text-charcoal mb-2">
              Number of Questions
            </label>
            <input
              id="numQuestions"
              type="number"
              min={MIN_QUESTIONS}
              max={MAX_QUESTIONS}
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value) || MIN_QUESTIONS)}
              className="w-full px-4 py-3 border-2 border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-dusty-blue focus:border-transparent text-charcoal"
              disabled={loading}
            />
            <p className="mt-1 text-sm text-warm-beige">
              Choose between {MIN_QUESTIONS} and {MAX_QUESTIONS} questions
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-charcoal mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-dusty-blue focus:border-transparent text-charcoal appearance-none bg-white cursor-pointer"
              disabled={loading}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-charcoal mb-2">
              Subcategory
            </label>
            <select
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-warm-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-dusty-blue focus:border-transparent text-charcoal appearance-none bg-white cursor-pointer"
              disabled={loading}
            >
              {subcategoryOptions.map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </div>

          {/* Error Messages */}
          {(validationError || error) && (
            <div className="bg-soft-red/10 border-2 border-soft-red rounded-lg p-4">
              <p className="text-soft-red text-sm">
                {validationError || error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dusty-blue hover:bg-dusty-blue/90 disabled:bg-warm-gray disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md min-h-[44px]"
            aria-label={loading ? "Generating quiz questions" : "Start quiz test"}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating your quiz...
              </span>
            ) : (
              'Start Test'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
