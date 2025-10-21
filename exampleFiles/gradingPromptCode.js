import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.responses.create({
  prompt: {
    "id": process.env.OPENAI_TEST_GRADING,
    "version": "7"
  },
  input: [],
  text: {
    "format": {
      "type": "json_schema",
      "name": "civics_quiz_results",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "questions": {
            "type": "array",
            "description": "List of quiz questions with responses and evaluation results.",
            "items": {
              "type": "object",
              "properties": {
                "category": {
                  "type": "string",
                  "description": "The main category of the question."
                },
                "subcategory": {
                  "type": "string",
                  "description": "The subcategory of the question."
                },
                "question": {
                  "type": "string",
                  "description": "The text of the quiz question."
                },
                "user_answer": {
                  "type": "string",
                  "description": "The answer provided by the user."
                },
                "answers": {
                  "type": "array",
                  "description": "All valid correct answers to the question.",
                  "items": {
                    "type": "string"
                  }
                },
                "result": {
                  "type": "string",
                  "description": "The evaluation result for the user's answer.",
                  "enum": [
                    "correct",
                    "incorrect"
                  ]
                },
                "matched_answer": {
                  "type": "string",
                  "description": "The correct answer that matched the user response, or an empty string if none."
                }
              },
              "required": [
                "category",
                "subcategory",
                "question",
                "user_answer",
                "answers",
                "result",
                "matched_answer"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "questions"
        ],
        "additionalProperties": false
      }
    },
    "verbosity": "medium"
  },
  reasoning: {},
  store: true,
  include: [
    "reasoning.encrypted_content",
    "web_search_call.action.sources"
  ]
});
