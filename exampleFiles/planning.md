/speckit.plan The application uses Next.js with minimal number of libraries.
The application should be a single page application.
The application uses Tailwind CSS for styling.
The application uses TypeScript.
The application uses Next.js for the backend.
The application uses Vercel for deployment.
The questions and answer checking are are derived from Open AI's prompt responses.

The application user inputs on the first page are:
- "number_of_questions" : Number of questions
- "category" : Category
- "subcategory" : Subcategory of the selected category.

Example data for inputs for the prompt: 
"category" = Examples: "Any" or "American Government", 
"subcategory"= "Any" or "Principles of American Democracy", 
"number_of_questions" = 2

Example OpenAI implementation code can be found in /exampleFiles/questionGenSample.js

The application will use the OpenAI API to generate the questions and answers and return them in the next page of the application to begin the test.

Example data output from prompt response:

```
{
  "category": "Any",
  "subcategory": "Any",
  "number_of_questions": 2,
  "questions": [
    {
      "category": "American Government",
      "subcategory": "System of Government",
      "question": "What are the two parts of the U.S. Congress?",
      "answers": [
        "The Senate",
        "The House of Representatives"
      ]
    },
    {
      "category": "American History",
      "subcategory": "Colonial Period",
      "question": "Who wrote the Declaration of Independence?",
      "answers": [
        "Thomas Jefferson"
      ]
    }
  ]
}
```

The user will not see the answer in the UI. Instead, they will type in their answer, and the answers will be evaluated against the official responses at the end of the quiz.

The user's response and question data will be combined in a data object that looks like this:

```
{
  "questions": [
    {
      "category": "American Government",
      "subcategory": "System of Government",
      "question": "What are the two parts of the U.S. Congress?",
      "user_answer": "senate",
      "answers": [
        "The Senate",
        "The House of Representatives"
      ]
    },
    {
      "category": "American History",
      "subcategory": "Colonial Period",
      "question": "Who wrote the Declaration of Independence?",
      "user_answer": "Kennedy",
      "answers": [
        "Thomas Jefferson"
      ]
    }
  ]
}
```

This user's answers will go in the "user_answer" field when as questions are answered. all the other data in the object are based on the previous data object that was generated for the questions in the first Open AI response.

With this data, it will be used as the input for another Open AI call, coding sample can be found in /exampleFiles/gradingPromptCode.js. This call will process the user's answer with the correct answer and verify if it is correct based on the available answers. 

The last page of the application will list out all the questions with the user's answer and the correct answers available. There is a color indication (red) if the answer was answered incorrectly or correctly. At the end of the results, the user can opt to retake the test and it will take the user back to the first page form.
