/**
 * Enhanced Test Examples for Native Grading Algorithm
 * 
 * Demonstrates improvements including:
 * - Number normalization
 * - Abbreviation expansion  
 * - Synonym matching
 * - Lower thresholds for short answers
 * - Token overlap matching
 * 
 * Run with: node test-grading-enhanced.js
 */

const NUMBER_WORDS = {
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

const ABBREVIATIONS = {
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

const SYNONYMS = {
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

function normalizeNumbers(text) {
  let normalized = text;
  
  for (const [digit, words] of Object.entries(NUMBER_WORDS)) {
    for (const word of words) {
      if (normalized.includes(word)) {
        normalized = normalized + ' ' + digit;
      }
    }
  }
  
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

function expandAbbreviations(text) {
  let expanded = text.toLowerCase();
  
  for (const [abbrev, full] of Object.entries(ABBREVIATIONS)) {
    if (expanded.includes(abbrev)) {
      expanded = expanded + ' ' + full;
    }
  }
  
  return expanded;
}

function addSynonyms(text) {
  let withSynonyms = text.toLowerCase();
  
  for (const [term, synonyms] of Object.entries(SYNONYMS)) {
    if (withSynonyms.includes(term)) {
      withSynonyms = withSynonyms + ' ' + synonyms.join(' ');
    }
  }
  
  return withSynonyms;
}

function normalizeAnswer(answer) {
  let normalized = answer.toLowerCase().trim();
  
  normalized = expandAbbreviations(normalized);
  normalized = normalizeNumbers(normalized);
  normalized = addSynonyms(normalized);
  
  normalized = normalized
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b(the|a|an|of|to|in|on|and|or)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return normalized;
}

function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

function hasSignificantOverlap(str1, str2) {
  const tokens1 = str1.split(' ').filter(t => t.length > 2);
  const tokens2 = str2.split(' ').filter(t => t.length > 2);
  
  if (tokens1.length === 0 || tokens2.length === 0) return false;
  
  const matches = tokens1.filter(t => tokens2.includes(t)).length;
  const minTokens = Math.min(tokens1.length, tokens2.length);
  
  return matches / minTokens >= 0.6;
}

function gradeAnswer(userAnswer, correctAnswers) {
  const normalizedUser = normalizeAnswer(userAnswer);
  
  for (const answer of correctAnswers) {
    const normalizedCorrect = normalizeAnswer(answer);
    
    // 1. Exact match
    if (normalizedUser === normalizedCorrect) {
      return { correct: true, matchedAnswer: answer, method: 'exact' };
    }
    
    // 2. Token overlap
    if (hasSignificantOverlap(normalizedUser, normalizedCorrect)) {
      return { correct: true, matchedAnswer: answer, method: 'token-overlap' };
    }
    
    // 3. Containment match
    if (normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)) {
      const minLen = Math.min(normalizedUser.length, normalizedCorrect.length);
      const maxLen = Math.max(normalizedUser.length, normalizedCorrect.length);
      const lengthRatio = minLen / maxLen;
      const threshold = minLen <= 5 ? 0.3 : 0.5;
      
      if (lengthRatio >= threshold) {
        return { correct: true, matchedAnswer: answer, method: 'containment', ratio: lengthRatio };
      }
    }
    
    // 4. Fuzzy match
    const distance = levenshteinDistance(normalizedUser, normalizedCorrect);
    const maxLength = Math.max(normalizedUser.length, normalizedCorrect.length);
    const similarity = 1 - (distance / maxLength);
    
    if (similarity >= 0.75) {
      return { correct: true, matchedAnswer: answer, method: 'fuzzy', similarity };
    }
  }
  
  return { correct: false, matchedAnswer: correctAnswers[0], method: 'none' };
}

// Enhanced Test Cases
const testCases = [
  {
    category: "📊 NUMBER NORMALIZATION",
    tests: [
      {
        question: "How many amendments does the Constitution have?",
        correctAnswers: ["twenty-seven (27)"],
        userAnswers: [
          "27",
          "twenty seven",
          "twenty-seven",
          "27 amendments",
          "twentyseven",
        ]
      },
      {
        question: "How many U.S. Senators are there?",
        correctAnswers: ["one hundred (100)", "100"],
        userAnswers: [
          "100",
          "one hundred",
          "hundred",
        ]
      }
    ]
  },
  {
    category: "🔤 ABBREVIATION EXPANSION",
    tests: [
      {
        question: "Who was the first President?",
        correctAnswers: ["George Washington"],
        userAnswers: [
          "George Washington",
          "G. Washington",
          "G Washington",
          "GW",
          "washington",
        ]
      },
      {
        question: "Who wrote the Declaration of Independence?",
        correctAnswers: ["Thomas Jefferson"],
        userAnswers: [
          "Thomas Jefferson",
          "T. Jefferson",
          "T Jefferson",
          "TJ",
          "jefferson",
        ]
      }
    ]
  },
  {
    category: "🔄 SYNONYM MATCHING",
    tests: [
      {
        question: "Who is the Commander in Chief?",
        correctAnswers: ["the President"],
        userAnswers: [
          "president",
          "the president",
          "commander in chief",
          "chief executive",
        ]
      },
      {
        question: "What did the Declaration of Independence do?",
        correctAnswers: ["announced our independence from Great Britain"],
        userAnswers: [
          "announced independence from Britain",
          "declared independence from England",
          "said we were free from the British",
          "independence from UK",
        ]
      }
    ]
  },
  {
    category: "📏 SHORT ANSWER HANDLING",
    tests: [
      {
        question: "What is the capital of the United States?",
        correctAnswers: ["Washington, D.C.", "Washington DC"],
        userAnswers: [
          "Washington DC",
          "washington dc",
          "DC",
          "WDC",
          "washington",
        ]
      },
      {
        question: "What is one right from the First Amendment?",
        correctAnswers: ["speech", "religion", "assembly", "press"],
        userAnswers: [
          "speech",
          "freedom of speech",
          "free speech",
          "religion",
          "press",
          "freedom of the press",
        ]
      }
    ]
  },
  {
    category: "🎯 TOKEN OVERLAP",
    tests: [
      {
        question: "What does the Constitution do?",
        correctAnswers: ["sets up the government", "defines the government"],
        userAnswers: [
          "sets up government",
          "government setup",
          "defines government",
          "establishes government structure",
        ]
      }
    ]
  }
];

console.log("🇺🇸 ENHANCED NATIVE GRADING ALGORITHM TEST RESULTS\n");
console.log("=".repeat(80));

testCases.forEach(testCategory => {
  console.log(`\n\n${testCategory.category}`);
  console.log("─".repeat(80));
  
  testCategory.tests.forEach((testCase, index) => {
    console.log(`\n${testCase.question}`);
    console.log(`✓ Correct: ${testCase.correctAnswers.join(", ")}\n`);
    
    testCase.userAnswers.forEach(userAnswer => {
      const result = gradeAnswer(userAnswer, testCase.correctAnswers);
      const icon = result.correct ? "✅" : "❌";
      const details = result.correct 
        ? `[${result.method}${result.ratio ? `, ratio: ${(result.ratio * 100).toFixed(1)}%` : ''}${result.similarity ? `, sim: ${(result.similarity * 100).toFixed(1)}%` : ''}]`
        : '';
      
      console.log(`   ${icon} "${userAnswer}" ${details}`);
    });
  });
});

console.log("\n" + "=".repeat(80));
console.log("\n📖 LEGEND:");
console.log("  exact         - Exact match after normalization");
console.log("  token-overlap - 60%+ of meaningful tokens match");
console.log("  containment   - One string contains the other (dynamic threshold)");
console.log("  fuzzy         - Levenshtein distance similarity ≥75%");
console.log("\n✅ = Correct | ❌ = Incorrect");

console.log("\n🎉 IMPROVEMENTS:");
console.log("  • Number normalization: '27' ↔ 'twenty-seven'");
console.log("  • Abbreviation expansion: 'G. Washington' → 'George Washington'");
console.log("  • Synonym matching: 'Britain' ↔ 'England' ↔ 'UK'");
console.log("  • Short answer handling: 'DC' matches 'Washington DC' (30% threshold)");
console.log("  • Token overlap: Matches reordered multi-word answers");
console.log("\n");
