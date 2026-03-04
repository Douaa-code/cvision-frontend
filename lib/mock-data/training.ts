import type { Training, CandidateTrainingProgress } from "@/types";

export const mockTrainings: Training[] = [
  {
    id: "tr1",
    companyId: "c1",
    jobOfferId: "1",
    title: "PHP Development Training",
    domain: "IT & Software",
    description:
      "Comprehensive training program covering advanced PHP development, Laravel framework, and best practices for the Senior PHP Developer role at Tech Solutions Inc.",
    position: "Senior PHP Developer at Tech Solutions Inc.",
    totalVideos: 12,
    totalCourses: 8,
    totalHours: 15,
    modules: [
      {
        moduleId: "m1",
        moduleTitle: "Introduction to Company Standards",
        lessons: [
          {
            lessonId: "l1",
            title: "Welcome & Overview",
            type: "video",
            duration: 15,
            completed: true,
            videoUrl: "#",
          },
          {
            lessonId: "l2",
            title: "Coding Standards & Guidelines",
            type: "text",
            duration: 20,
            completed: true,
            content: "Our company follows PSR-12 coding standards for all PHP code. This includes proper indentation (4 spaces), naming conventions (camelCase for methods, PascalCase for classes), and mandatory docblocks for all public methods. Code reviews are mandatory before merging any pull request.",
          },
          {
            lessonId: "l3",
            title: "Module 1 Quiz",
            type: "quiz",
            duration: 10,
            completed: true,
            questionText: "Which coding standard does our company follow for PHP development?",
            options: [
              { id: "A", text: "PSR-2" },
              { id: "B", text: "PSR-12" },
              { id: "C", text: "PSR-4" },
              { id: "D", text: "PEAR" },
            ],
            correctAnswer: "B",
          },
        ],
      },
      {
        moduleId: "m2",
        moduleTitle: "Advanced Laravel Patterns",
        lessons: [
          {
            lessonId: "l4",
            title: "Repository Pattern",
            type: "video",
            duration: 30,
            completed: true,
            videoUrl: "#",
          },
          {
            lessonId: "l5",
            title: "Service Layer Architecture",
            type: "video",
            duration: 25,
            completed: false,
            videoUrl: "#",
          },
          {
            lessonId: "l6",
            title: "Event-Driven Design",
            type: "text",
            duration: 20,
            completed: false,
            content: "Events and listeners in Laravel allow decoupled communication between components. Use `php artisan make:event` and `make:listener` to scaffold them. Register listeners in `EventServiceProvider`. This pattern is ideal for sending notifications, logging, and triggering background jobs without tight coupling.",
          },
          {
            lessonId: "l7",
            title: "Module 2 Quiz",
            type: "quiz",
            duration: 15,
            completed: false,
            questionText: "What is the main advantage of the Repository Pattern in Laravel?",
            options: [
              { id: "A", text: "It speeds up database queries automatically" },
              { id: "B", text: "It abstracts data access logic from business logic" },
              { id: "C", text: "It replaces the need for Eloquent models" },
              { id: "D", text: "It provides built-in caching for all queries" },
            ],
            correctAnswer: "B",
          },
        ],
      },
      {
        moduleId: "m3",
        moduleTitle: "Database & Performance",
        lessons: [
          {
            lessonId: "l8",
            title: "Query Optimization",
            type: "video",
            duration: 35,
            completed: false,
            videoUrl: "#",
          },
          {
            lessonId: "l9",
            title: "Caching Strategies",
            type: "video",
            duration: 25,
            completed: false,
            videoUrl: "#",
          },
          {
            lessonId: "l10",
            title: "Final Assessment",
            type: "quiz",
            duration: 20,
            completed: false,
            questionText: "Which strategy is most effective for reducing N+1 query problems in Laravel?",
            options: [
              { id: "A", text: "Using raw SQL queries instead of Eloquent" },
              { id: "B", text: "Increasing the server memory limit" },
              { id: "C", text: "Eager loading relationships with `with()`" },
              { id: "D", text: "Disabling query logging in production" },
            ],
            correctAnswer: "C",
          },
        ],
      },
    ],
    createdAt: new Date("2026-01-25"),
    updatedAt: new Date("2026-01-25"),
  },
];

export const mockTrainingProgress: CandidateTrainingProgress[] = [
  {
    id: "tp1",
    candidateId: "u1",
    trainingId: "tr1",
    progress: 40,
    completedLessons: ["l1", "l2", "l3", "l4"],
    startedAt: new Date("2026-01-28"),
    updatedAt: new Date("2026-02-10"),
  },
];
