import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Question } from '@/app/types';

/**
 * Selects questions with balanced distribution across categories
 * when "Any" category is selected, to avoid bias toward larger categories
 */
function selectBalancedQuestions(
  allQuestions: Question[],
  count: number,
  askedQuestionIds: Set<string>
): Question[] {
  // Group questions by category
  const questionsByCategory = new Map<string, (Question & { id: string })[]>();
  
  allQuestions.forEach((q, index) => {
    const questionId = `${index}-${q.question.slice(0, 50)}`; // Unique ID based on index and question text
    
    // Skip questions that have been asked recently
    if (askedQuestionIds.has(questionId)) {
      return;
    }
    
    if (!questionsByCategory.has(q.category)) {
      questionsByCategory.set(q.category, []);
    }
    const questionWithId: Question & { id: string } = { ...q, id: questionId };
    questionsByCategory.get(q.category)!.push(questionWithId);
  });
  
  // If we've asked most questions, reset the tracking
  const totalAvailable = Array.from(questionsByCategory.values())
    .reduce((sum, questions) => sum + questions.length, 0);
  
  if (totalAvailable < count) {
    // Reset and try again with all questions
    askedQuestionIds.clear();
    return selectBalancedQuestions(allQuestions, count, askedQuestionIds);
  }
  
  const categories = Array.from(questionsByCategory.keys());
  const selectedQuestions: (Question & { id: string })[] = [];
  
  // Distribute questions evenly across categories
  let categoryIndex = 0;
  while (selectedQuestions.length < count) {
    const currentCategory = categories[categoryIndex % categories.length];
    const categoryQuestions = questionsByCategory.get(currentCategory);
    
    if (categoryQuestions && categoryQuestions.length > 0) {
      // Randomly pick from this category
      const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
      const selected = categoryQuestions[randomIndex];
      selectedQuestions.push(selected);
      
      // Remove from available pool
      categoryQuestions.splice(randomIndex, 1);
      
      // If category is exhausted, remove it from rotation
      if (categoryQuestions.length === 0) {
        questionsByCategory.delete(currentCategory);
        const idx = categories.indexOf(currentCategory);
        categories.splice(idx, 1);
        
        if (categories.length === 0) {
          break; // No more questions available
        }
      }
    }
    
    categoryIndex++;
  }
  
  return selectedQuestions;
}

/**
 * Creates a unique identifier for a question based on its position and content
 */
function createQuestionId(question: Question, index: number): string {
  return `${index}-${question.question.slice(0, 50)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, subcategory, number_of_questions, asked_questions = [] } = body;
    
    // Validation
    if (!number_of_questions || number_of_questions < 1 || number_of_questions > 25) {
      return NextResponse.json(
        { error: 'Invalid number_of_questions: must be between 1 and 25' },
        { status: 400 }
      );
    }
    
    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or invalid category field' },
        { status: 400 }
      );
    }
    
    if (!subcategory || typeof subcategory !== 'string' || subcategory.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or invalid subcategory field' },
        { status: 400 }
      );
    }
    
    // Read questions from JSON file
    const filePath = join(process.cwd(), 'citizenship_questions.json');
    const fileContents = await readFile(filePath, 'utf8');
    const allQuestions: Question[] = JSON.parse(fileContents);
    
    // Convert asked_questions array to Set for efficient lookup
    const askedQuestionIds = new Set<string>(asked_questions);
    
    let selectedQuestions: Question[];
    
    // Special handling for "Any" category - use balanced selection
    if (category === 'Any' && subcategory === 'Any') {
      selectedQuestions = selectBalancedQuestions(
        allQuestions,
        number_of_questions,
        askedQuestionIds
      );
    } else {
      // Standard filtering for specific categories/subcategories
      let filteredQuestions = allQuestions;
      
      // Filter by category (if not "Any")
      if (category !== 'Any') {
        filteredQuestions = filteredQuestions.filter(q => q.category === category);
      }
      
      // Filter by subcategory (if not "Any")
      if (subcategory !== 'Any') {
        filteredQuestions = filteredQuestions.filter(q => q.subcategory === subcategory);
      }
      
      // Check if we have enough questions
      if (filteredQuestions.length === 0) {
        return NextResponse.json(
          { error: 'No questions found for the selected category and subcategory' },
          { status: 404 }
        );
      }
      
      // Filter out recently asked questions
      const availableQuestions = filteredQuestions.filter((q) => {
        const questionId = createQuestionId(q, allQuestions.indexOf(q));
        return !askedQuestionIds.has(questionId);
      });
      
      // If we've asked most questions in this category, reset and use all
      const questionsPool = availableQuestions.length >= number_of_questions
        ? availableQuestions
        : filteredQuestions;
      
      // Randomly select the requested number of questions
      const tempSelected: Question[] = [];
      const tempAvailable = [...questionsPool];
      const questionsToSelect = Math.min(number_of_questions, tempAvailable.length);
      
      for (let i = 0; i < questionsToSelect; i++) {
        const randomIndex = Math.floor(Math.random() * tempAvailable.length);
        tempSelected.push(tempAvailable[randomIndex]);
        tempAvailable.splice(randomIndex, 1);
      }
      
      selectedQuestions = tempSelected;
    }
    
    // Add question IDs to the selected questions for client tracking
    const questionsWithIds = selectedQuestions.map((q) => {
      const originalIndex = allQuestions.findIndex(
        original => original.question === q.question && original.category === q.category
      );
      return {
        ...q,
        id: createQuestionId(q, originalIndex),
      };
    });
    
    // Return response in the expected format
    const response = {
      category,
      subcategory,
      number_of_questions: questionsWithIds.length,
      questions: questionsWithIds,
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Question generation error:', error);
    return NextResponse.json(
      { error: 'Failed to load questions. Please try again.' },
      { status: 500 }
    );
  }
}
