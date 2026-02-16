import type {
  WilayaEnum,
  DomainEnum,
  EducationEnum,
  ExperienceEnum,
  SalaryEnum,
  ContractEnum,
  ApplicationStatusEnum,
  CompanyStatusEnum,
  TestStatusEnum,
} from "./enums";

export type UserRole = "candidate" | "company" | "admin";

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  wilaya: WilayaEnum;
  postalCode: string;
  streetAddress?: string;
  educationLevel: EducationEnum;
  fieldOfStudy: DomainEnum;
  university: string;
  graduationYear: number;
  yearsOfExperience: ExperienceEnum;
  currentPosition?: string;
  currentCompany?: string;
  skills: string[];
  languages: {
    name: string;
    level: "Native" | "Fluent" | "Intermediate";
  }[];
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Company = {
  id: string;
  companyName: string;
  activityDomain: DomainEnum;
  professionalEmail: string;
  phoneNumber: string;
  website?: string;
  wilaya: WilayaEnum;
  postalCode: string;
  description: string;
  documents: {
    commercialRegister: {
      filename: string;
      url: string;
      uploadedAt: Date;
    };
    nifDocument: {
      filename: string;
      url: string;
      uploadedAt: Date;
    };
    additionalDocs?: {
      filename: string;
      url: string;
      uploadedAt: Date;
    }[];
  };
  adminFullName: string;
  adminEmail: string;
  status: CompanyStatusEnum;
  registrationDate: Date;
  approvedDate?: Date;
  approvedBy?: string;
  jobOffersCount: number;
  totalApplications: number;
  acceptedCandidates: number;
  createdAt: Date;
  updatedAt: Date;
};

export type JobOffer = {
  id: string;
  companyId: string;
  companyName?: string;
  companyLogo?: string;
  jobTitle: string;
  jobDescription: string;
  requirements: string[];
  responsibilities: string[];
  contractType: ContractEnum;
  domain: DomainEnum;
  wilaya: WilayaEnum;
  postalCode: string;
  salaryRange: SalaryEnum;
  experienceRequired: ExperienceEnum;
  maxAcceptedCandidates: number;
  currentAccepted: number;
  requireQCMTest: boolean;
  linkedTestId?: string;
  status: "Active" | "Closed";
  postedDate: Date;
  applicationsCount: number;
  matchPercentage?: number;
  saved?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Application = {
  id: string;
  candidateId: string;
  candidateName?: string;
  jobId: string;
  jobTitle?: string;
  companyId: string;
  companyName?: string;
  appliedDate: Date;
  currentStatus: ApplicationStatusEnum;
  compatibilityScore: number;
  testStatus?: TestStatusEnum;
  testScore?: number;
  testCompletedAt?: Date;
  decision?: "Accept" | "Reject";
  decisionDate?: Date;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Question = {
  id: string;
  questionText: string;
  questionType: "multiple_choice";
  options: {
    id: "A" | "B" | "C" | "D";
    text: string;
    isCorrect: boolean;
  }[];
  attachedMedia?: {
    type: "image" | "video";
    url: string;
  };
};

export type Test = {
  id: string;
  companyId: string;
  jobOfferId?: string;
  testName: string;
  domain: DomainEnum;
  description: string;
  duration: number;
  passingScore: number;
  numberOfQuestions: number;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
};

export type Training = {
  id: string;
  companyId: string;
  jobOfferId?: string;
  title: string;
  domain: DomainEnum;
  description: string;
  position?: string;
  totalVideos: number;
  totalCourses: number;
  totalHours: number;
  modules: {
    moduleId: string;
    moduleTitle: string;
    lessons: {
      lessonId: string;
      title: string;
      type: "video" | "text" | "quiz";
      duration: number;
      completed?: boolean;
      videoUrl?: string;
      content?: string;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type CandidateTrainingProgress = {
  id: string;
  candidateId: string;
  trainingId: string;
  progress: number;
  completedLessons: string[];
  startedAt: Date;
  completedAt?: Date;
  updatedAt: Date;
};
