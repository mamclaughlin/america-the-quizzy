import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.responses.create({
  prompt: {
    "id": process.env.OPENAI_TEST_GEN,
    "version": "5",
    "variables": {
      "category": "example category",
      "subcategory": "example subcategory",
      "number_of_questions": "example number_of_questions"
    }
  }
});
