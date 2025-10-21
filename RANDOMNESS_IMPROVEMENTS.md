# Question Randomness Improvements

## Overview
Enhanced the question selection algorithm to ensure better randomness across all categories when "Any" is selected, and added localStorage tracking to avoid repeating recently asked questions.

## Changes Made

### 1. Backend: Balanced Question Selection (`app/api/generate-questions/route.ts`)
- **New Algorithm**: When category is "Any" and subcategory is "Any", questions are now distributed evenly across all three categories (American Government, American History, Integrated Civics)
- **Round-Robin Selection**: Instead of purely random selection (which biased toward American Government due to its larger question pool), the algorithm now:
  - Groups questions by category
  - Rotates through categories, picking one question from each category at a time
  - Ensures equal representation from each category

### 2. Question Tracking
- **Unique Question IDs**: Each question is now assigned a unique ID based on its index and question text
- **Asked Questions Filtering**: The API accepts an `asked_questions` array and filters out previously asked questions
- **Auto-Reset**: When most questions in a category have been asked, the system automatically resets to allow questions to be re-asked

### 3. Frontend: LocalStorage Integration (`app/page.tsx`)
- **Persistent Tracking**: Asked questions are stored in localStorage under key `america-quizzy-asked-questions`
- **Automatic Saving**: After quiz completion, question IDs are automatically saved to localStorage
- **Future Quiz Loading**: When starting a new quiz, previously asked questions are loaded from localStorage and sent to the API

### 4. Type Updates (`app/types/index.ts`)
- Added optional `id` field to `Question` interface for tracking purposes

## How It Works

1. **User starts quiz with "Any" category**:
   - Frontend loads previously asked question IDs from localStorage
   - Sends request to API with the list of asked questions
   
2. **API generates questions**:
   - For "Any" category: Uses balanced selection algorithm
   - Groups available questions by category
   - Excludes questions that have been asked recently
   - Distributes selections evenly across categories
   
3. **User completes quiz**:
   - Question IDs are saved to localStorage
   - Next quiz will avoid these questions

4. **Reset behavior**:
   - If there aren't enough unasked questions, the system automatically resets the tracking
   - Questions can be asked again once most have been exhausted

## Benefits

- ✅ True randomness across all categories when "Any" is selected
- ✅ No more American Government bias (previously ~57% of question pool)
- ✅ Questions won't repeat until most have been asked
- ✅ Better learning experience with diverse question coverage
- ✅ Automatic reset prevents the system from getting stuck

## Testing

To test the improvements:

1. **Category Distribution Test**:
   - Select "Any" category and "Any" subcategory
   - Generate 10 questions
   - Verify questions come from multiple categories (not just American Government)

2. **Question Tracking Test**:
   - Complete a quiz with 10 questions
   - Start a new quiz with same settings
   - Verify you get different questions (stored in localStorage)

3. **Clear History** (for testing):
   - Open browser console
   - Run: `localStorage.removeItem('america-quizzy-asked-questions')`
   - This clears the question history

## Technical Details

### Question ID Format
```
{index}-{first_50_chars_of_question}
```
Example: `0-What is the supreme law of the land?`

### localStorage Key
```
america-quizzy-asked-questions
```

### API Request Format
```json
{
  "category": "Any",
  "subcategory": "Any",
  "number_of_questions": 10,
  "asked_questions": ["0-What is the supreme...", "1-What does the Con..."]
}
```

## Future Enhancements (Optional)

- Add a "Clear Question History" button in the UI
- Show statistics on how many questions have been asked
- Add category-specific tracking (e.g., track American History separately)
- Implement difficulty progression based on performance
