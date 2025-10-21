import { NextRequest, NextResponse } from 'next/server';

/**
 * Number to word mappings for normalization
 */
const NUMBER_WORDS: Record<string, string[]> = {
  '1': ['one', 'first'],
  '2': ['two', 'second'],
  '3': ['three', 'third'],
  '4': ['four', 'fourth'],
  '5': ['five', 'fifth'],
  '6': ['six', 'sixth'],
  '7': ['seven', 'seventh'],
  '8': ['eight', 'eighth'],
  '9': ['nine', 'ninth'],
  '10': ['ten', 'tenth'],
  '11': ['eleven', 'eleventh'],
  '12': ['twelve', 'twelfth'],
  '13': ['thirteen', 'thirteenth'],
  '14': ['fourteen', 'fourteenth'],
  '15': ['fifteen', 'fifteenth'],
  '16': ['sixteen', 'sixteenth'],
  '17': ['seventeen', 'seventeenth'],
  '18': ['eighteen', 'eighteenth'],
  '19': ['nineteen', 'nineteenth'],
  '20': ['twenty', 'twentieth'],
  '21': ['twenty-one', 'twenty one', 'twentyone'],
  '22': ['twenty-two', 'twenty two', 'twentytwo'],
  '23': ['twenty-three', 'twenty three', 'twentythree'],
  '24': ['twenty-four', 'twenty four', 'twentyfour'],
  '25': ['twenty-five', 'twenty five', 'twentyfive'],
  '26': ['twenty-six', 'twenty six', 'twentysix'],
  '27': ['twenty-seven', 'twenty seven', 'twentyseven'],
  '50': ['fifty', 'fiftieth'],
  '100': ['one hundred', 'hundred'],
  '435': ['four hundred thirty-five', 'four hundred thirty five'],
};

/**
 * Common name abbreviations and expansions
 */
const ABBREVIATIONS: Record<string, string> = {
  'g washington': 'george washington',
  'g w': 'george washington',
  'gw': 'george washington',
  'j adams': 'john adams',
  'ja': 'john adams',
  't jefferson': 'thomas jefferson',
  'tj': 'thomas jefferson',
  'j madison': 'james madison',
  'jm': 'james madison',
  'j monroe': 'james monroe',
  'a lincoln': 'abraham lincoln',
  'abe lincoln': 'abraham lincoln',
  'f roosevelt': 'franklin roosevelt',
  'fdr': 'franklin delano roosevelt',
  'franklin d roosevelt': 'franklin roosevelt',
  't roosevelt': 'theodore roosevelt',
  'teddy roosevelt': 'theodore roosevelt',
  'us': 'united states',
  'usa': 'united states',
  'dc': 'washington',
  'wdc': 'washington',
};

/**
 * Synonym mappings for common answer variations
 */
const SYNONYMS: Record<string, string[]> = {
  'president': ['commander in chief', 'chief executive', 'commander chief'],
  'constitution': ['supreme law', 'constitutional'],
  'freedom': ['liberty', 'right'],
  'vote': ['ballot', 'cast ballot', 'elect'],
  'congress': ['legislative branch', 'legislature'],
  'supreme court': ['highest court', 'scotus'],
  'senate': ['upper house', 'senators'],
  'house': ['house of representatives', 'lower house', 'representatives'],
  'cabinet': ['advisors', 'executive advisors'],
  'bill of rights': ['first ten amendments', 'first 10 amendments'],
  'independence': ['freedom', 'liberty'],
  'britain': ['england', 'great britain', 'british', 'uk'],
  'native american': ['american indian', 'native americans', 'american indians', 'indigenous'],
};

/**
 * Converts numbers in text to their word equivalents and vice versa
 */
function normalizeNumbers(text: string): string {
  let normalized = text;
  
  // Convert word numbers to digits for comparison
  for (const [digit, words] of Object.entries(NUMBER_WORDS)) {
    for (const word of words) {
      // Add digit as an alternative
      if (normalized.includes(word)) {
        normalized = normalized + ' ' + digit;
      }
    }
  }
  
  // Also add words for any digits found
  const digitMatches = normalized.match(/\b\d+\b/g);
  if (digitMatches) {
    for (const digit of digitMatches) {
      const words = NUMBER_WORDS[digit];
      if (words) {
        normalized = normalized + ' ' + words.join(' ');
      }
    }
  }
  
  return normalized;
}

/**
 * Expands common abbreviations
 */
function expandAbbreviations(text: string): string {
  let expanded = text.toLowerCase();
  
  for (const [abbrev, full] of Object.entries(ABBREVIATIONS)) {
    if (expanded.includes(abbrev)) {
      expanded = expanded + ' ' + full;
    }
  }
  
  return expanded;
}

/**
 * Adds synonyms to text for better matching
 */
function addSynonyms(text: string): string {
  let withSynonyms = text.toLowerCase();
  
  for (const [term, synonyms] of Object.entries(SYNONYMS)) {
    if (withSynonyms.includes(term)) {
      withSynonyms = withSynonyms + ' ' + synonyms.join(' ');
    }
  }
  
  return withSynonyms;
}

/**
 * Normalizes an answer string for comparison by:
 * - Converting to lowercase
 * - Expanding abbreviations
 * - Normalizing numbers
 * - Adding synonyms
 * - Removing punctuation
 * - Normalizing whitespace
 * - Removing common articles and conjunctions
 */
function normalizeAnswer(answer: string): string {
  let normalized = answer.toLowerCase().trim();
  
  // Apply enhancements
  normalized = expandAbbreviations(normalized);
  normalized = normalizeNumbers(normalized);
  normalized = addSynonyms(normalized);
  
  // Clean up
  normalized = normalized
    // Remove punctuation
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"\[\]]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove common articles that don't affect meaning
    .replace(/\b(the|a|an|of|to|in|on|and|or)\b/g, ' ')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();
  
  return normalized;
}

/**
 * Calculates Levenshtein distance between two strings
 * Used for fuzzy matching when exact/partial matches don't work
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Checks if two normalized strings have overlapping tokens
 * Useful for multi-word answers where order might vary
 */
function hasSignificantOverlap(str1: string, str2: string): boolean {
  const tokens1 = str1.split(' ').filter(t => t.length > 2);
  const tokens2 = str2.split(' ').filter(t => t.length > 2);
  
  if (tokens1.length === 0 || tokens2.length === 0) return false;
  
  const matches = tokens1.filter(t => tokens2.includes(t)).length;
  const minTokens = Math.min(tokens1.length, tokens2.length);
  
  // If 60% or more tokens match, consider it a match
  return matches / minTokens >= 0.6;
}

/**
 * Grades a user's answer against an array of correct answers
 * Returns whether the answer is correct and which official answer matched
 */
function gradeAnswer(
  userAnswer: string,
  correctAnswers: string[]
): { correct: boolean; matchedAnswer: string } {
  const normalizedUser = normalizeAnswer(userAnswer);
  
  // Try each correct answer
  for (const answer of correctAnswers) {
    const normalizedCorrect = normalizeAnswer(answer);
    
    // 1. Exact match after normalization
    if (normalizedUser === normalizedCorrect) {
      return { correct: true, matchedAnswer: answer };
    }
    
    // 2. Token overlap check (for answers with synonyms or reordering)
    if (hasSignificantOverlap(normalizedUser, normalizedCorrect)) {
      return { correct: true, matchedAnswer: answer };
    }
    
    // 3. Containment match (one contains the other)
    if (normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)) {
      // Dynamic threshold based on answer length
      const minLen = Math.min(normalizedUser.length, normalizedCorrect.length);
      const maxLen = Math.max(normalizedUser.length, normalizedCorrect.length);
      const lengthRatio = minLen / maxLen;
      
      // Lower threshold for very short answers (2-5 chars)
      const threshold = minLen <= 5 ? 0.3 : 0.5;
      
      if (lengthRatio >= threshold) {
        return { correct: true, matchedAnswer: answer };
      }
    }
    
    // 4. Fuzzy match using Levenshtein distance
    const distance = levenshteinDistance(normalizedUser, normalizedCorrect);
    const maxLength = Math.max(normalizedUser.length, normalizedCorrect.length);
    const similarity = 1 - (distance / maxLength);
    
    // Accept if similarity is >= 75% (lowered from 80% for better tolerance)
    if (similarity >= 0.75) {
      return { correct: true, matchedAnswer: answer };
    }
  }
  
  // No match found
  return { correct: false, matchedAnswer: correctAnswers[0] };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questions } = body;
    
    // Validation
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid questions array' },
        { status: 400 }
      );
    }
    
    // Check each question has user_answer
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].user_answer || typeof questions[i].user_answer !== 'string') {
        return NextResponse.json(
          { error: `Missing or invalid user_answer in question at index ${i}` },
          { status: 400 }
        );
      }
    }
    
    // Grade each question using native fuzzy matching
    const gradedQuestions = questions.map((q: any) => {
      const { correct, matchedAnswer } = gradeAnswer(q.user_answer, q.answers);
      
      return {
        category: q.category,
        subcategory: q.subcategory,
        question: q.question,
        user_answer: q.user_answer,
        answers: q.answers,
        result: correct ? 'correct' : 'incorrect',
        matched_answer: matchedAnswer
      };
    });
    
    return NextResponse.json({ questions: gradedQuestions });
    
  } catch (error) {
    console.error('Answer grading error:', error);
    return NextResponse.json(
      { error: 'Failed to grade answers. Please try again.' },
      { status: 500 }
    );
  }
}
