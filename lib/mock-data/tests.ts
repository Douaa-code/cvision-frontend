import type { Test } from "@/types";

export const mockTests: Test[] = [
  {
    id: "t1",
    companyId: "c1",
    jobOfferId: "1",
    testName: "PHP Developer Assessment",
    domain: "IT & Software",
    description:
      "Test your PHP development skills including Laravel, MySQL, and API design. This test is required for the Senior PHP Developer position.",
    duration: 60,
    passingScore: 70,
    numberOfQuestions: 10,
    questions: [
      {
        id: "q1",
        questionText: "Which of the following is NOT a valid PHP data type?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "String", isCorrect: false },
          { id: "B", text: "Integer", isCorrect: false },
          { id: "C", text: "Character", isCorrect: true },
          { id: "D", text: "Boolean", isCorrect: false },
        ],
      },
      {
        id: "q2",
        questionText:
          "What is the correct way to define a route in Laravel?",
        questionType: "multiple_choice",
        options: [
          {
            id: "A",
            text: "Route::get('/url', [Controller::class, 'method']);",
            isCorrect: true,
          },
          {
            id: "B",
            text: "Router.get('/url', Controller.method);",
            isCorrect: false,
          },
          {
            id: "C",
            text: "app.route('/url').get(controller.method);",
            isCorrect: false,
          },
          {
            id: "D",
            text: "Route('/url', 'GET', Controller@method);",
            isCorrect: false,
          },
        ],
      },
      {
        id: "q3",
        questionText:
          "Which MySQL command is used to create a new database?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "NEW DATABASE dbname;", isCorrect: false },
          { id: "B", text: "CREATE DATABASE dbname;", isCorrect: true },
          { id: "C", text: "MAKE DATABASE dbname;", isCorrect: false },
          { id: "D", text: "ADD DATABASE dbname;", isCorrect: false },
        ],
      },
      {
        id: "q4",
        questionText: "What does the 'use' keyword do in PHP namespaces?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "Creates a new namespace", isCorrect: false },
          { id: "B", text: "Imports a class or namespace", isCorrect: true },
          { id: "C", text: "Exports a module", isCorrect: false },
          { id: "D", text: "Defines a trait", isCorrect: false },
        ],
      },
      {
        id: "q5",
        questionText:
          "Which HTTP method is typically used to update an existing resource in a REST API?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "POST", isCorrect: false },
          { id: "B", text: "GET", isCorrect: false },
          { id: "C", text: "PUT", isCorrect: true },
          { id: "D", text: "DELETE", isCorrect: false },
        ],
      },
      {
        id: "q6",
        questionText:
          "What is Eloquent in the context of Laravel?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "A template engine", isCorrect: false },
          { id: "B", text: "An ORM (Object-Relational Mapping)", isCorrect: true },
          { id: "C", text: "A testing framework", isCorrect: false },
          { id: "D", text: "A routing system", isCorrect: false },
        ],
      },
      {
        id: "q7",
        questionText: "What is the output of: echo 5 + '5 cats';",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "55 cats", isCorrect: false },
          { id: "B", text: "10", isCorrect: true },
          { id: "C", text: "Error", isCorrect: false },
          { id: "D", text: "5 cats", isCorrect: false },
        ],
      },
      {
        id: "q8",
        questionText:
          "Which function is used to prevent SQL injection in PHP PDO?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "mysql_real_escape_string()", isCorrect: false },
          { id: "B", text: "prepare() with bound parameters", isCorrect: true },
          { id: "C", text: "sanitize_sql()", isCorrect: false },
          { id: "D", text: "filter_input()", isCorrect: false },
        ],
      },
      {
        id: "q9",
        questionText:
          "What does SOLID stand for in software development?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "Simple Object Linking and Design", isCorrect: false },
          {
            id: "B",
            text: "Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion",
            isCorrect: true,
          },
          { id: "C", text: "Secure Object Language Interface Design", isCorrect: false },
          { id: "D", text: "Standard Object-oriented Library for Integrated Development", isCorrect: false },
        ],
      },
      {
        id: "q10",
        questionText:
          "What is the purpose of middleware in Laravel?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "To connect to the database", isCorrect: false },
          { id: "B", text: "To filter HTTP requests entering the application", isCorrect: true },
          { id: "C", text: "To render views", isCorrect: false },
          { id: "D", text: "To compile assets", isCorrect: false },
        ],
      },
    ],
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "t3",
    companyId: "c4",
    jobOfferId: "5",
    testName: "React Frontend Assessment",
    domain: "IT & Software",
    description:
      "Assess your React and frontend development knowledge. Required for the Frontend Developer position at EduTech Algeria.",
    duration: 45,
    passingScore: 65,
    numberOfQuestions: 5,
    questions: [
      {
        id: "rq1",
        questionText: "What hook is used for side effects in React?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "useState", isCorrect: false },
          { id: "B", text: "useEffect", isCorrect: true },
          { id: "C", text: "useContext", isCorrect: false },
          { id: "D", text: "useReducer", isCorrect: false },
        ],
      },
      {
        id: "rq2",
        questionText: "What is JSX?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "A JavaScript runtime", isCorrect: false },
          { id: "B", text: "A syntax extension for JavaScript", isCorrect: true },
          { id: "C", text: "A CSS framework", isCorrect: false },
          { id: "D", text: "A database query language", isCorrect: false },
        ],
      },
      {
        id: "rq3",
        questionText: "Which is NOT a way to style React components?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "CSS Modules", isCorrect: false },
          { id: "B", text: "Styled Components", isCorrect: false },
          { id: "C", text: "PHP Stylesheets", isCorrect: true },
          { id: "D", text: "Inline styles", isCorrect: false },
        ],
      },
      {
        id: "rq4",
        questionText: "What is the virtual DOM?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "A lightweight copy of the real DOM", isCorrect: true },
          { id: "B", text: "A new browser API", isCorrect: false },
          { id: "C", text: "A server-side rendering technique", isCorrect: false },
          { id: "D", text: "A CSS optimization method", isCorrect: false },
        ],
      },
      {
        id: "rq5",
        questionText: "What does 'key' prop do in a list?",
        questionType: "multiple_choice",
        options: [
          { id: "A", text: "Encrypts the list data", isCorrect: false },
          { id: "B", text: "Helps React identify changed items", isCorrect: true },
          { id: "C", text: "Sorts the list items", isCorrect: false },
          { id: "D", text: "Styles the list items", isCorrect: false },
        ],
      },
    ],
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
];

export const mockCandidateTestResults = [
  {
    testId: "t1",
    testName: "PHP Developer Assessment",
    jobTitle: "Senior PHP Developer",
    score: 88,
    total: 100,
    status: "Passed" as const,
    completedDate: new Date("2026-01-22"),
  },
];
