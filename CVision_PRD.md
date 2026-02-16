# CVision - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** 15 Février 2026  
**Project Type:** Frontend Web Application  
**Target Market:** Algeria

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Tech Stack](#tech-stack)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Core Features](#core-features)
6. [Design System](#design-system)
7. [Page Structure](#page-structure)
8. [Data Models](#data-models)
9. [User Flows](#user-flows)
10. [Animation Guidelines](#animation-guidelines)
11. [Development Phases](#development-phases)
12. [Performance Requirements](#performance-requirements)

---

## 1. Executive Summary

**CVision** is an AI-powered recruitment platform specifically designed for the Algerian market. The platform connects job seekers with verified companies across Algeria's 58 wilayas, featuring smart CV analysis, AI-based job matching, online assessments, and training modules.

### Key Objectives:
- Streamline recruitment process in Algeria
- Provide AI-powered candidate-job matching
- Ensure company verification and authenticity
- Offer skill validation through tests and training
- Support all 58 Algerian wilayas

---

## 2. Project Overview

### 2.1 Product Vision
Create a modern, efficient, and trustworthy recruitment ecosystem for Algeria that leverages AI to match the right candidates with the right opportunities.

### 2.2 Target Users
1. **Job Seekers (Candidates)** - Algerian professionals seeking employment
2. **Companies** - Verified Algerian businesses looking to hire
3. **Super Admin** - Platform administrators managing the ecosystem

### 2.3 Core Value Propositions
- **For Candidates:** AI-powered job matching, skill development, career growth
- **For Companies:** Access to qualified, verified candidates, streamlined hiring
- **For Platform:** Trusted recruitment ecosystem, data-driven insights

---

## 3. Tech Stack

### 3.1 Frontend Framework
- **Next.js 14+** (App Router)
  - Server Components for performance
  - Client Components for interactivity
  - API Routes for frontend logic
  - Middleware for authentication routing

### 3.2 Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **Aceternity UI** - Premium UI components for enhanced UX
- **CSS Variables** - For theming and design tokens

### 3.3 Animation Libraries
- **Framer Motion** - React animation library for page transitions, micro-interactions
- **GSAP** - Advanced animations for complex sequences, scroll-triggered animations

### 3.4 Development Tools
- **AI Copilot** - Code assistance
- **Context 7** - Development acceleration
- **TypeScript** - Type safety (recommended)
- **ESLint + Prettier** - Code quality

### 3.5 State Management (Recommendations)
- **React Context** - For theme, user session
- **Zustand** - For global state (optional)
- **React Query / SWR** - For data fetching (when backend is ready)

### 3.6 Form Handling
- **React Hook Form** - Performance-focused form management
- **Zod** - Schema validation

---

## 4. User Roles & Permissions

### 4.1 Candidate
**Access:**
- Public pages (Home, About)
- Job search and filtering
- Profile management
- Application tracking
- Tests and training modules
- Settings

**Restrictions:**
- Cannot create job offers
- Cannot access company dashboard
- Cannot access admin features

### 4.2 Company
**Access:**
- Company dashboard
- Create/manage job offers
- View/manage applicants
- Create custom tests
- Create training modules
- Company profile settings

**Restrictions:**
- Must be verified to post jobs
- Cannot access admin panel
- Cannot view other companies' data

### 4.3 Super Admin
**Access:**
- Complete platform overview
- Analytics dashboard
- Company verification/approval
- User management
- Platform settings
- All data access

**Restrictions:**
- Cannot apply for jobs as candidate
- Separate login flow

---

## 5. Core Features

### 5.1 Authentication System

#### 5.1.1 Candidate Registration
**Fields:**
```javascript
{
  // Personal Details
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string,
  
  // Location
  wilaya: WilayaEnum, // Dropdown of 58 wilayas
  postalCode: string, // Linked to wilaya
  
  // Education & Experience
  educationLevel: EducationEnum,
  fieldOfStudy: DomainEnum,
  university: string,
  graduationYear: number,
  yearsOfExperience: ExperienceEnum,
  
  // Skills
  skills: string[], // Comma-separated, max 10
  
  // Languages
  languages: Language[] // [{name, level: 'Native'|'Fluent'|'Intermediate'}]
}
```

#### 5.1.2 Company Registration (3-Step Process)

**Step 1: Company Information**
```javascript
{
  companyName: string,
  activityDomain: DomainEnum,
  professionalEmail: string,
  phoneNumber: string,
  website?: string,
  wilaya: WilayaEnum,
  postalCode: string,
  description: string
}
```

**Step 2: Document Upload**
```javascript
{
  commercialRegister: File, // RC - PDF/JPG/PNG, Max 5MB
  nifDocument: File, // NIF - PDF/JPG/PNG, Max 5MB
  additionalDocs?: File[] // Optional
}
```

**Step 3: Administrator Account**
```javascript
{
  adminFullName: string,
  adminEmail: string,
  password: string,
  confirmPassword: string,
  termsAccepted: boolean
}
```

**Status Flow:**
```
Submitted → Pending Approval → Approved/Rejected
```

**Approval Time:** 1-3 business days

#### 5.1.3 Login
**Common Fields:**
- Email
- Password
- Remember me (checkbox)
- Forgot password link

**Post-Login Routing:**
- Candidate → `/dashboard`
- Company → `/company/dashboard`
- Super Admin → `/admin/dashboard`

---

### 5.2 Job Search & Matching

#### 5.2.1 Search Interface
**Filters:**
```javascript
{
  searchQuery: string, // Job title, company, keywords
  wilaya: WilayaEnum[],
  salaryRange: SalaryEnum,
  contractType: ContractEnum[],
  domain: DomainEnum[],
  experienceRequired: ExperienceEnum,
  postedDate: 'today' | 'week' | 'month' | 'all'
}
```

#### 5.2.2 Job Card Display
```javascript
{
  jobTitle: string,
  companyName: string,
  companyLogo?: string,
  location: string, // Wilaya
  salaryRange: string,
  contractType: string,
  domain: string,
  postedDate: Date,
  matchPercentage: number, // AI-calculated, 0-100%
  applicationsCount: number,
  saved: boolean
}
```

**Match Percentage Badge:**
- 85%+ → Green (#00C897)
- 70-84% → Yellow (#FFC107)
- <70% → Gray

#### 5.2.3 Job Details Page
**Sections:**
1. Header (Title, Company, Location, Salary)
2. Match Score (with breakdown)
3. Job Description
4. Requirements (bullets)
5. Responsibilities (bullets)
6. Company Description
7. Application CTA
8. Similar Jobs

---

### 5.3 Application Process

#### 5.3.1 Application Flow
```
View Job → Check Match → Apply → [Test if Required] → Submitted
```

#### 5.3.2 Application Data
```javascript
{
  candidateId: string,
  jobId: string,
  appliedDate: Date,
  currentStatus: 'Pending' | 'Accepted' | 'Rejected',
  testStatus?: 'Not Started' | 'Completed' | 'Passed' | 'Failed',
  testScore?: number,
  compatibility: number // AI match %
}
```

#### 5.3.3 Candidate Dashboard
**Metrics:**
- Applications Sent: number
- Pending Reviews: number
- Jobs Saved: number
- Highest Compatibility: percentage

**Recent Applications Table:**
| Job Title | Company | Applied Date | Status | Decision | Actions |
|-----------|---------|--------------|--------|----------|---------|
| Senior PHP Developer | Tech Solutions Inc. | 2024-07-20 | Accepted | Pending | View Details / Confirm Offer |

**Status Badges:**
- Accepted → Green background (#CCF4EA), text (#00C897)
- Pending → Yellow background (#FFF3CD), text (#FFC107)
- Rejected → Red background (#FDEDEB), text (#E74C3C)

---

### 5.4 Tests & Assessments

#### 5.4.1 Test Structure
```javascript
{
  testId: string,
  testName: string,
  domain: DomainEnum,
  description: string,
  duration: number, // minutes
  passingScore: number, // percentage
  numberOfQuestions: number,
  questions: Question[]
}
```

#### 5.4.2 Question Format (QCM)
```javascript
{
  questionId: string,
  questionText: string,
  questionType: 'multiple_choice',
  options: [
    { id: 'A', text: string, isCorrect: boolean },
    { id: 'B', text: string, isCorrect: boolean },
    { id: 'C', text: string, isCorrect: boolean },
    { id: 'D', text: string, isCorrect: boolean }
  ],
  attachedMedia?: {
    type: 'image' | 'video',
    url: string
  }
}
```

#### 5.4.3 Test Interface
**Features:**
- Question counter (e.g., "Question 1/50")
- Timer countdown
- Option selection (radio buttons)
- Previous/Next navigation
- Flag for review
- Submit confirmation

**Post-Test:**
- Score display
- Pass/Fail status
- Detailed feedback (optional)

---

### 5.5 Training Modules

#### 5.5.1 Training Structure
```javascript
{
  trainingId: string,
  title: string,
  domain: DomainEnum,
  description: string,
  position: string, // e.g., "Senior PHP Developer at Tech Solutions Inc."
  progress: number, // 0-100%
  totalVideos: number,
  totalCourses: number,
  totalHours: number,
  modules: Module[]
}
```

#### 5.5.2 Module Format
```javascript
{
  moduleId: string,
  moduleTitle: string,
  lessons: [
    {
      lessonId: string,
      title: string,
      type: 'video' | 'text' | 'quiz',
      duration: number,
      completed: boolean,
      videoUrl?: string,
      content?: string
    }
  ]
}
```

#### 5.5.3 Training Dashboard
**Display:**
- Active trainings (cards with progress bars)
- Continue Training button
- Review button (if completed)

---

### 5.6 Company Features

#### 5.6.1 Company Dashboard
**KPIs:**
- Active Job Offers: number
- Total Applications: number
- Pending Reviews: number
- Accepted Candidates: number

**Recent Applications Table:**
| Candidate | Job Title | Compatibility | Applied Date | Test Status | Status | Actions |
|-----------|-----------|---------------|--------------|-------------|--------|---------|
| John Doe | Senior PHP Developer | 85% | 2026-12-15 | Completed (88/100) | Pending | Review |

#### 5.6.2 Create Job Offer
**Form Sections:**

**Job Information:**
```javascript
{
  jobTitle: string,
  jobDescription: string, // Rich text editor
  requirements: string[], // Bullet list
  responsibilities: string[] // Bullet list
}
```

**Job Details:**
```javascript
{
  contractType: ContractEnum,
  domain: DomainEnum,
  wilaya: WilayaEnum,
  postalCode: string,
  salaryRange: SalaryEnum,
  experienceRequired: ExperienceEnum
}
```

**Application Settings:**
```javascript
{
  maxAcceptedCandidates: number, // e.g., 5
  requireQCMTest: boolean,
  linkedTestId?: string // If requireQCMTest = true
}
```

#### 5.6.3 Recruitment Management
**Candidate Detail View:**
```javascript
{
  // Candidate Info
  name: string,
  email: string,
  phone: string,
  location: string,
  postalCode: string,
  experience: string,
  
  // Application Details
  jobTitle: string,
  appliedDate: Date,
  currentStatus: string,
  testStatus: string,
  testScore?: number,
  
  // AI Analysis
  matchPercentage: 85,
  aiSummary: {
    skills: string[],
    experience: string,
    education: string,
    domain: string,
    languages: string[]
  },
  
  // Decision Interface
  decision: null | 'Accept' | 'Reject',
  comments: string
}
```

**Actions:**
- Accept Candidate (green button)
- Reject Candidate (red button)
- Comment box for feedback

---

### 5.7 Super Admin Panel

#### 5.7.1 Admin Dashboard
**Overview Metrics:**
- Total Companies: 156
- Pending Approvals: 8
- Total Candidates: 1,234
- Active Job Offers: 456

**Pending Company Approvals Table:**
| Company Name | Domain | Email | Registration Date | Status | Actions |
|--------------|--------|-------|-------------------|--------|---------|
| Innovate Solutions Corp. | IT/Software | contact@innovate.com | 2026-12-15 | Pending | Review |

**Recent Platform Activity:**
- 5 new job offers posted today
- 23 new candidate registrations
- 45 new job applications received
- 2 companies approved this week
- 3 tests completed by candidates
- 3 trainings completed by candidates

#### 5.7.2 Company Approval Flow
**Company Information Display:**
```javascript
{
  companyName: string,
  domain: string,
  email: string,
  phone: string,
  postalCode: string,
  wilaya: string,
  registrationDate: Date,
  status: 'Pending Approval'
}
```

**Admin Account:**
```javascript
{
  adminName: string,
  adminEmail: string
}
```

**Uploaded Documents:**
- Commercial Register (RC) - rc_document.pdf [View Document] [Download]
- NIF Document - nif_document.pdf [View Document] [Download]

**Admin Decision:**
- Decision dropdown: Select Decision / Approve / Reject / Request More Info
- Comments/Notes textarea
- Approve Company (green button)
- Reject Company (red button)
- More Information (blue button)

#### 5.7.3 Companies List
**Filters:**
- Search by name
- All Statuses / All Domains / All Wilayas
- Apply Filters button

**Table:**
| Company Name | Domain | Email | Wilaya | Job Offers | Status | Registration Date | Actions |
|--------------|--------|-------|--------|------------|--------|-------------------|---------|
| Tech Solutions Inc. | IT/Software | info@techsolutions.com | Algiers | 12 | Approved | 2023-11-15 | View |

**Status Options:**
- Approved (green)
- Pending (yellow)
- Rejected (red)

#### 5.7.4 Company Detail
**Company Overview:**
- Status + badge
- Registration Date
- Approved Date
- Approved By: Admin User

**Actions:**
- Review/Edit Approval (button)
- Suspend Company (red button)

**Company Information:**
- Company Name
- Domain
- Email
- Phone
- Post Code
- Wilaya
- Website
- Description

**Admin Account:**
- Admin Name
- Admin Email
- Account Status: Active

**Company Documents:**
- Commercial Register (RC) - 1.2 MB [Download] [Preview]
- NIF Document - 850 KB [Download] [Preview]
- Company Bylaws - 2.5 MB [Download] [Preview]

**Company Statistics:**
- Active Job Offers: 12
- Total Applications: 156
- Accepted Candidates: 28

#### 5.7.5 Candidates List
**Filters:**
- Domain: All Domains
- Wilaya: All Wilayas
- Experience: Any
- Search by name
- Apply Filters

**Table:**
| Name | Email | Domain | Experience | Wilaya | Applications | Level | Registration Date |
|------|-------|--------|------------|--------|--------------|-------|-------------------|
| John Doe | john.doe@example.com | IT/Software | 2-5 years | Algiers | 12 | Master's Degree | 2026-11-10 |

#### 5.7.6 Platform Analytics
**Platform Overview:**
- Total Candidates: 1,234 (↑15% this month)
- Total Companies: 156 (↑8% this month)
- Active Job Offers: 456 (↑12% this month)
- Total Applications: 2,890 (↑22% this month)

**Platform Statistics:**

**Applications Over Time:**
Graph showing monthly application submissions (Jan-Jun)

**Top Domains:**
Bar chart showing job offers by industry:
- IT & Software: 400
- Marketing: 300
- Finance: 200
- Healthcare: 250
- Law: 150

**User Registration Trends:**
Line graph showing new registrations per month (Jan-Jun)

**Geographic Distribution:**
Pie chart showing user distribution by region:
- Oran
- Algiers
- Béjaïa

**Recent Activity Summary:**
| Date | Activity | Count |
|------|----------|-------|
| Today | New Applications | 45 |
| Today | New Candidate Registrations | 23 |
| Today | New Company Registrations | 2 |
| Today | Tests Completed | 36 |
| This Week | Total Job Offers Created | 125 |

#### 5.7.7 Users Management
**Overview:**
- Total Candidates: 1,234
- Total Companies: 156
- Total Users: 1,390
- Active Today: 23

**Filter Users:**
- All User Types / All Statuses / All Time
- Search users...
- Apply Filters

**User Listings:**
| User Type | Name/Company | Email | Registration Date | Last Login | Status | Actions |
|-----------|--------------|-------|-------------------|------------|--------|---------|
| Candidate | John Doe | john.doe@example.com | 2023-11-10 | 2023-12-17 | Active | Suspend |
| Company | Tech Solutions Inc. | contact@techso.com | 2023-11-15 | 2023-12-17 | Active | Suspend |

**Action Buttons:**
- Suspend (red) / Activate (green)

#### 5.7.8 Job Offers Management
**Filter Job Offers:**
- All Status / All Domains / All Companies
- Apply Filters

**Table:**
| Job Title | Company | Domain | Location | Applications | Status | Posted Date |
|-----------|---------|--------|----------|--------------|--------|-------------|
| Senior Backend Developer (Node.js) | Tech Solutions Inc. | Software Development | Remote | 78 | Active | 2024-03-10 |

**Status Options:**
- Active (green)
- Closed (red)

#### 5.7.9 Applications Overview
**Overview:**
- Total Applications: 2890
- Pending: 856
- Accepted: 1234
- Rejected: 800

**Filter Applications:**
- Search applications...
- All Status / All Domains / All Time
- Apply Filters

**Application Records:**
| Candidate | Job Title | Company | Compatibility | Test Score | Status | Applied Date |
|-----------|-----------|---------|---------------|------------|--------|--------------|
| John Doe | Senior PHP Developer | Tech Company Algeria | 85% | 85/100 | Pending | 2026-12-15 |

#### 5.7.10 Platform Settings
**Tabs:**
- Platform Settings
- Security Settings

**Platform Settings:**
- Platform Name: CVision Platform
- Current Email: hi.hello@gmail.com
- New Email: happy.day@gmail.com
- Confirm New Email: happy.day@gmail.com
- Save Changes (button)

**Security:**
- Current Password: ••••••••
- New Password: ••••••••
- New Password: ••••••••
- Changes Password (button)

---

## 6. Design System

### 6.1 Color Palette

#### Primary Colors
```css
--background: #F0F7FF;
--bar-background: #F3F4F6;
--container-gray: #F9FAFB;
```

#### Action Colors
```css
/* Success/Accept */
--button-green-bg: #CCF4EA;
--button-green-text: #00C897;

/* Danger/Reject */
--button-red-bg: #FDEDEB;
--button-red-text: #E74C3C;

/* Warning/Pending */
--button-yellow-bg: #FFF3CD;
--button-yellow-text: #FFC107;

/* Admin/Primary */
--admin-blue: #1E90FF;
```

#### Text Colors
```css
--text-primary: #1F2937;
--text-secondary: #6B7280;
--text-muted: #9CA3AF;
```

#### Border Colors
```css
--border-light: #E5E7EB;
--border-default: #D1D5DB;
```

### 6.2 Typography

#### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### 6.3 Spacing Scale
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### 6.4 Component Styles

#### Buttons
```javascript
// Primary Button (Green)
className="bg-[#00C897] text-white hover:bg-[#00B589] px-6 py-3 rounded-lg font-medium transition-colors"

// Secondary Button (Outlined)
className="border-2 border-[#00C897] text-[#00C897] hover:bg-[#CCF4EA] px-6 py-3 rounded-lg font-medium transition-colors"

// Danger Button (Red)
className="bg-[#E74C3C] text-white hover:bg-[#D73C2C] px-6 py-3 rounded-lg font-medium transition-colors"

// Badge - Accepted
className="bg-[#CCF4EA] text-[#00C897] px-3 py-1 rounded-full text-sm font-medium"

// Badge - Pending
className="bg-[#FFF3CD] text-[#FFC107] px-3 py-1 rounded-full text-sm font-medium"

// Badge - Rejected
className="bg-[#FDEDEB] text-[#E74C3C] px-3 py-1 rounded-full text-sm font-medium"
```

#### Cards
```javascript
className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow"
```

#### Inputs
```javascript
className="w-full px-4 py-3 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#00C897] focus:border-transparent outline-none transition-all"
```

### 6.5 Layout Grid
```css
/* Container */
max-width: 1280px;
margin: 0 auto;
padding: 0 1rem;

/* Grid System */
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 1.5rem;
```

---

## 7. Page Structure

### 7.1 Public Pages

#### 7.1.1 Homepage (`/`)
**Sections:**
1. **Hero Section**
   - Headline: "Connecting Job Seekers and Companies in Algeria"
   - Subheading: AI-powered platform description
   - CTA: "Job Search" & "Job Posting"
   - Hero Image: Business meeting illustration

2. **Why Choose CVision?**
   - 6 feature cards in grid (2x3):
     - Localized for Algeria (flag icon)
     - AI-Powered Matching (sparkle icon)
     - Verified Companies (shield icon)
     - Training Programs (book icon)
     - Skill Validation (badge icon)
     - Data Privacy & Security (lock icon)

3. **How It Works** (Timeline)
   - Step 1: Complete Profile (user icon)
   - Step 2: AI Analysis (brain icon)
   - Step 3: Apply & Test (clipboard icon)
   - Step 4: Get Hired & Train (trophy icon)

4. **Ready to Get Started?**
   - "Create Account as Candidate" (green)
   - "Create Account as Company" (green)

**Footer:**
- Quick Links (Home, About Us, Login)
- For Job Seekers (Register as Candidate)
- For Employers (Register as Company)
- Social icons (Facebook, Twitter, LinkedIn, Instagram)
- Copyright: "© 2026 CVision. All rights reserved."

#### 7.1.2 About Page (`/about`)
**Sections:**
1. **About CVision**
   - Mission statement
   - Vision for Algeria's recruitment market

2. **Our Vision**
   - Goals and objectives
   - AI and transparency focus

3. **Key Features** (6 icons with descriptions)
   - AI-Powered Matching
   - Verified Companies
   - Localized for Algeria
   - Skill Validation
   - Training Programs
   - Direct Communication

4. **Why Choose CVision?** (4 cards)
   - Smart Matching
   - Secure & Verified
   - Made for Algeria
   - Career Growth

5. **Contact Us**
   - Email: support@cvision.dz
   - Phone: +213 6 XX XX XX XX
   - Get Started as Candidate / Employer buttons

---

### 7.2 Candidate Pages

#### 7.2.1 Dashboard (`/dashboard`)
**Layout:**
- Sidebar navigation (Dashboard, My Profile, Job Search, Tests, Training, Settings)
- Top bar (Dashboard, Job Search, My Profile, Logout)

**Content:**
- Dashboard Overview heading
- 4 KPI cards:
  - Applications Sent (25) with icon
  - Pending Reviews (4) with icon
  - Jobs Saved (1) with icon
  - Highest Compatibility (85%) with icon

- Notice box (if multiple offers accepted):
  "You have been accepted by one or more companies. Please note that you can choose only one company. Once you confirm your choice, you will be officially recruited, and your profile will be locked for other offers. You will then gain access to the training and onboarding process of the selected company. This action is final and cannot be changed. Choose carefully before confirming your decision."

- Recent Applications table
- Recommended Jobs section (grid of job cards)

#### 7.2.2 Profile (`/profile`)
**Sections:**
1. Personal Information (editable)
   - Profile photo upload
   - First Name, Last Name
   - Email, Phone Number

2. Location
   - Wilaya (dropdown)
   - Postal Code
   - Street Address

3. Education
   - Highest Degree (dropdown)
   - Field of Study
   - University/School
   - Graduation Year

4. Professional Experience
   - Years of Experience (dropdown)
   - Current/Previous Position
   - Current/Previous Company

5. Skills
   - Skills list (comma-separated)

6. Languages
   - Languages with proficiency levels

**Actions:**
- Cancel / Save Changes buttons

#### 7.2.3 Job Search (`/jobs`)
**Layout:**
- Search bar with keyword input
- Filters panel (Wilaya, Salary Range, Contract Type, Domain)
- Sort by dropdown
- Job cards grid (3 columns)
- Pagination

**Job Card:**
- Company logo
- Job title
- Company name
- Location icon + wilaya
- Salary icon + range
- Contract badge (CDI/CDD/etc)
- Skills tags
- Match percentage badge
- "88% Match" / "View Details" button

#### 7.2.4 Job Details (`/jobs/[id]`)
**Sections:**
1. Header
   - Job title
   - Company name
   - Location, Salary, Contract type
   - Posted date
   - Match score (85% Match with your profile)

2. Job Description
3. Requirements (bullet list)
4. Responsibilities (bullet list)
5. Company Description
6. Application buttons:
   - "Apply Now" (green)
   - "Save Job" (outlined)

#### 7.2.5 Tests (`/tests`)
**Dashboard:**
- Total Tests: 12
- Pending Tests: 3
- Highest Score: 88%

**Pending Tests:**
- PHP Developer Test card
  - Required for: Senior PHP Developer position
  - Duration: 60 minutes
  - 50 questions
  - Passing: 70%
  - "Start Test" button

- General IT Skills Test card
  - Required for: Multiple IT positions
  - Duration: 45 minutes
  - 40 questions
  - Passing: 65%
  - "Start Test" button

**Completed Tests Table:**
| Test Name | Job Position | Score | Status | Completed Date |
|-----------|--------------|-------|--------|----------------|
| PHP Developer Test | Senior PHP Developer | 88/100 (88%) | Passed | 2024-06-15 |

#### 7.2.6 Test Interface (`/tests/[id]`)
**Layout:**
- Test header (name, domain, description)
- Timer (countdown)
- Question counter (e.g., "1/50 Questions")

**Question Display:**
- Question text
- 4 options (radio buttons: A, B, C, D)
- Attached media (image/video if applicable)

**Navigation:**
- Previous / Next buttons
- Submit button (last question)

#### 7.2.7 Training (`/training`)
**Active Training Card:**
- Title: "PHP Development Training"
- Position: "For Position: Senior PHP Developer at Tech Solutions Inc."
- Progress bar (60% Complete)
- Stats: 12 videos, 8 courses, 15 hours
- "Continue Training" button

**Completed Training:**
- "Review" button

#### 7.2.8 Training Content (`/training/[id]`)
**Layout:**
- Training header (title, domain, description)
- Question 1 section
  - Question text
  - Options (radio buttons)
  - Attached media (image)

- Question 2 section
  - Question text
  - Options (radio buttons)

- Question 3 section
  - Question text
  - Options (radio buttons)
  - Attached media (video)

**Actions:**
- "Send Training" (green button)
- "Cancel" (red button)

#### 7.2.9 Settings (`/settings`)
**Tabs:**
- Profile Settings
- Security
- Account

**Profile Settings:**
- Name input
- Email input
- Save Changes button

**Security:**
- Current Password
- New Password
- Confirm New Password
- Save Changes button

**Account:**
- Danger Zone box
  - "Deleting your account will permanently remove all your data, applications, and test results."
  - "Delete Account" button (red)

---

### 7.3 Company Pages

#### 7.3.1 Company Dashboard (`/company/dashboard`)
**Layout:**
- Sidebar (Dashboard, Company Profile, Create Job Offer, Job Offers, Applicants, Recruitment, Create Test, Create Training, Settings)
- Top bar (Dashboard, Create Job, Company Profile, Logout)

**Key Performance Indicators:**
- Active Job Offers: 8 (briefcase icon)
- Total Applications: 45 (clipboard icon)
- Pending Reviews: 12 (hourglass icon)
- Accepted Candidates: 8 (checkmark icon)

**Recent Applications Table:**
| Candidate Name | Job Title | Compatibility | Applied Date | Status | Actions |
|----------------|-----------|---------------|--------------|--------|---------|
| John Doe | Senior PHP Developer | 85% | 2026-12-15 | Pending | Review |

**Active Job Offers:**
- Senior PHP Developer card
  - 45 Applications
  - 5 Accepted
  - "Manage" button

- Marketing Manager card
  - 32 Applications
  - 3 Accepted
  - "Manage" button

- Full Stack Developer card
  - 58 Applications
  - 12 Accepted
  - "Manage" button

#### 7.3.2 Company Profile (`/company/profile`)
**Company Information:**
- Company Name
- Activity Domain (dropdown)
- Professional Email
- Phone Number
- Website (optional)
- Wilaya (dropdown)
- Postal Code
- Company Description (textarea)

**Administrator Account:**
- Admin Full Name
- Admin Email
- Change Password (leave blank to keep current)
- Confirm New Password

**Company Documents:**
- Current Documents section
  - Commercial Register (RC) - rc_document.pdf
  - NIF Document (NIF) - nif_document.pdf
  - "To update documents, please contact our support team."

**Actions:**
- Save Changes (green)
- Cancel (red)

#### 7.3.3 Create Job Offer (`/company/jobs/create`)
**Form Sections:**

**Job Information:**
- Job Title
- Job Description (textarea)
- Requirements (textarea - bullet list)
- Responsibilities (textarea - bullet list)

**Job Details:**
- Contract Type (dropdown)
- Domain (dropdown)
- Wilaya (dropdown)
- Postal Code
- Salary (dropdown)
- Experience Required (dropdown)

**Application Settings:**
- Maximum Number of Accepted Candidates (number input, default: 5)
- Require QCM Test (checkbox)
  - If checked: Choose Job Offer (dropdown)

**Actions:**
- Create Job Offer (green)
- Cancel (red)

#### 7.3.4 Job Offers List (`/company/jobs`)
**Header:**
- "Create New Job Offer" button (green with + icon)

**Filters:**
- Status: All Status
- Domain: All Domains
- Apply Filters

**Table:**
| Job Title | Domain | Applications | Accepted | Status | Actions |
|-----------|--------|--------------|----------|--------|---------|
| Senior PHP Developer | IT/Software | 45 | 5/5 | Active | View Applicants / Edit |

#### 7.3.5 Applicants List (`/company/applicants`)
**Filters:**
- Job Offer: All Job Offer
- Status: All Status
- Compatibility: Any
- Apply Filters

**Table:**
| Candidate Name | Job Title | Compatibility | Test Status | Status | Actions |
|----------------|-----------|---------------|-------------|--------|---------|
| John Doe | Senior PHP Developer | 85% | Completed | Pending | Review |

#### 7.3.6 Recruitment Management (`/company/recruitment/[id]`)
**Candidate Information:**
- Profile photo
- Name: John Doe
- Email: john.doe@example.com
- Phone: +213 555 123 456
- Location: Tlemcen
- Postal Code: 13003
- Experience: 2-5 years

**85% Match badge**

**Application Details:**
- Job Title: Senior PHP Developer
- Applied Date: 2026-12-15
- Current Status: Pending (yellow badge)
- Test Status: Completed (Score: 88/100) (green badge)

**AI Analysis Summary:**
- Skills: PHP, MySQL, JavaScript, Laravel, HTML, CSS
- Experience: 2-5 years in PHP development
- Previous Position: Junior PHP Developer at Company Tech Solutions DZ
- Education: Bachelor's in Computer Science at University of Algiers
- Graduation Year 2020
- Domain: IT / Software Development
- Languages: Arabic, French, English

**Decision Section:**
- Decision dropdown: Select Decision
- Comments textarea: "Add your comments about this candidate..."

**Action Buttons:**
- Accept Candidate (green)
- Reject Candidate (red)

#### 7.3.7 Create Test (`/company/tests/create`)
**Test Information:**
- Job Offer (dropdown: "Choose Job Offer")
- Test Name (e.g., "PHP Developer Assessment")
- Domain (dropdown: "Select Domain")
- Test Description (textarea)

**Test Configuration:**
- Duration (minutes): 60
- Passing Score (%): 70
- Number of Questions: 50

**Questions:**
- Question Format: Multiple Choice Questions (QCM)
- Note: "Each question should have one correct answer and 2-4 incorrect options, click on correct answer"

**Question 1:**
- Question Text: "Enter your question here..."
- Options:
  - Option A (radio + input)
  - Option B (radio + input)
  - Option C (radio + input)
  - Option D (radio + input)
- "Remove Question" button (red)

**Actions:**
- "+ Add Another Question"
- "Publish Test" (green)
- "Cancel" (red)

#### 7.3.8 Create Training (`/company/training/create`)
**Training Information:**
- Job Offer (dropdown)
- Training Name (e.g., "Introduction to AI in Recruitment")
- Domain (dropdown)
- Description (textarea)

**Test Configuration:**
- Duration (minutes): 80
- Passing Score (%): 70
- Number of Questions: 50

**Questions:**
- Question Format: Multiple choice questions for the training
- "Create multiple choice questions for the training. Each question should have one correct answer."

**Question 1:**
- Question Text: "Which of the following is NOT a common application of AI in recruitment?"
- Options:
  - Automated resume screening (radio)
  - Manual scheduling of interviews (radio + correct)
  - Chatbots for candidate engagement (radio)
  - A systematic error in an algorithm that leads to unfair outcomes (radio)
- "+ Add Another Option"
- Attached Media section
  - Upload image/video
  - "+ Add Media"
- "Remove Question" (red)

**Question 2:**
- Similar structure
- "No media attached"

**Question 3:**
- Similar structure
- Video attachment icon

**Actions:**
- "+ Add Another Question"
- "Publish Training" (green)
- "Cancel" (red)

#### 7.3.9 Company Settings (`/company/settings`)
**Tabs:**
- Company Settings
- Security
- Account

**Company Settings:**
- Company Name
- Company Email
- Save Changes

**Security:**
- Current Password
- New Password
- Confirm New Password
- Changes Password

**Account:**
- Danger Zone
  - "Deleting your account will permanently remove all your data, applications, and test results."
  - "Delete Account" (red)

---

### 7.4 Super Admin Pages

#### 7.4.1 Admin Dashboard (`/admin/dashboard`)
**Layout:**
- Sidebar navigation:
  - Dashboard (with sub-menu: Dashboard, Analytics)
  - Companies (with sub-menu: Companies List, Company Approval, Company Detail)
  - Users (with sub-menu: Candidates, Users Management)
  - Platform (with sub-menu: Job Offers, Applications, Settings)

**Overview Cards:**
- Total Companies: 156
- Pending Approvals: 8
- Total Candidates: 1,234
- Active Job Offers: 456

**Pending Company Approvals Table:**
(Already detailed in 5.7.1)

**Recent Platform Activity:**
(Already detailed in 5.7.1)

**Actions:**
- "Review Pending Companies" button
- "View Platform Analytics" button

#### 7.4.2 Analytics (`/admin/analytics`)
(Already detailed in 5.7.6)

#### 7.4.3 Companies List (`/admin/companies`)
(Already detailed in 5.7.3)

#### 7.4.4 Company Approval (`/admin/companies/approval/[id]`)
(Already detailed in 5.7.2)

#### 7.4.5 Company Detail (`/admin/companies/[id]`)
(Already detailed in 5.7.4)

#### 7.4.6 Candidates List (`/admin/candidates`)
(Already detailed in 5.7.5)

#### 7.4.7 Users Management (`/admin/users`)
(Already detailed in 5.7.7)

#### 7.4.8 Job Offers Management (`/admin/jobs`)
(Already detailed in 5.7.8)

#### 7.4.9 Applications Management (`/admin/applications`)
(Already detailed in 5.7.9)

#### 7.4.10 Platform Settings (`/admin/settings`)
(Already detailed in 5.7.10)

---

## 8. Data Models

### 8.1 Enums

```typescript
// Wilayas of Algeria (58 wilayas)
enum WilayaEnum {
  ADRAR = 'Adrar',
  CHLEF = 'Chlef',
  LAGHOUAT = 'Laghouat',
  OUM_EL_BOUAGHI = 'Oum El Bouaghi',
  BATNA = 'Batna',
  BEJAIA = 'Béjaïa',
  BISKRA = 'Biskra',
  BECHAR = 'Béchar',
  BLIDA = 'Blida',
  BOUIRA = 'Bouira',
  TAMANRASSET = 'Tamanrasset',
  TEBESSA = 'Tébessa',
  TLEMCEN = 'Tlemcen',
  TIARET = 'Tiaret',
  TIZI_OUZOU = 'Tizi Ouzou',
  ALGIERS = 'Algiers',
  DJELFA = 'Djelfa',
  JIJEL = 'Jijel',
  SETIF = 'Sétif',
  SAIDA = 'Saïda',
  SKIKDA = 'Skikda',
  SIDI_BEL_ABBES = 'Sidi Bel Abbès',
  ANNABA = 'Annaba',
  GUELMA = 'Guelma',
  CONSTANTINE = 'Constantine',
  MEDEA = 'Médéa',
  MOSTAGANEM = 'Mostaganem',
  MSILA = 'M\'Sila',
  MASCARA = 'Mascara',
  OUARGLA = 'Ouargla',
  ORAN = 'Oran',
  EL_BAYADH = 'El Bayadh',
  ILLIZI = 'Illizi',
  BORDJ_BOU_ARRERIDJ = 'Bordj Bou Arréridj',
  BOUMERDES = 'Boumerdès',
  EL_TARF = 'El Tarf',
  TINDOUF = 'Tindouf',
  TISSEMSILT = 'Tissemsilt',
  EL_OUED = 'El Oued',
  KHENCHELA = 'Khenchela',
  SOUK_AHRAS = 'Souk Ahras',
  TIPAZA = 'Tipaza',
  MILA = 'Mila',
  AIN_DEFLA = 'Aïn Defla',
  NAAMA = 'Naâma',
  AIN_TEMOUCHENT = 'Aïn Témouchent',
  GHARDAIA = 'Ghardaïa',
  RELIZANE = 'Relizane',
  TIMIMOUN = 'Timimoun',
  BORDJ_BADJI_MOKHTAR = 'Bordj Badji Mokhtar',
  OULED_DJELLAL = 'Ouled Djellal',
  BENI_ABBES = 'Béni Abbès',
  IN_SALAH = 'In Salah',
  IN_GUEZZAM = 'In Guezzam',
  TOUGGOURT = 'Touggourt',
  DJANET = 'Djanet',
  EL_MEGHAIER = 'El Meghaier',
  EL_MENIAA = 'El Meniaa'
}

// Postal codes linked to each Wilaya
// Example: Adrar → 01001, Chlef → 02001, etc.

enum DomainEnum {
  IT_SOFTWARE = 'IT & Software',
  HEALTHCARE = 'Healthcare',
  ENGINEERING = 'Engineering',
  EDUCATION = 'Education',
  BUSINESS_MANAGEMENT = 'Business & Management',
  MARKETING = 'Marketing',
  FINANCE = 'Finance',
  LAW = 'Law',
  ARTS_MEDIA = 'Arts & Media',
  CONSTRUCTION = 'Construction',
  TRANSPORTATION = 'Transportation',
  HOSPITALITY_TOURISM = 'Hospitality & Tourism'
}

enum EducationEnum {
  HIGH_SCHOOL = 'High School Diploma',
  BACHELORS = 'Bachelor\'s Degree',
  MASTERS = 'Master\'s Degree',
  MAGISTER = 'Magister Degree',
  PHD = 'PhD (Doctoral Degree)'
}

enum ExperienceEnum {
  ENTRY = '0-1 years (Entry Level)',
  JUNIOR = '2-5 years',
  MID = '5-10 years',
  SENIOR = '10+ years'
}

enum SalaryEnum {
  RANGE_1 = '0 - 50,000 DA',
  RANGE_2 = '50,000 - 100,000 DA',
  RANGE_3 = '100,000 - 200,000 DA',
  RANGE_4 = '200,000 + DA'
}

enum ContractEnum {
  CDI = 'CDI',
  CDD = 'CDD',
  INTERNSHIP = 'Internship',
  FREELANCE = 'Freelance'
}

enum ApplicationStatusEnum {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected'
}

enum CompanyStatusEnum {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

enum TestStatusEnum {
  NOT_STARTED = 'Not Started',
  COMPLETED = 'Completed',
  PASSED = 'Passed',
  FAILED = 'Failed'
}
```

### 8.2 Type Definitions

```typescript
// User Types
type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string; // hashed
  
  // Location
  wilaya: WilayaEnum;
  postalCode: string;
  streetAddress?: string;
  
  // Education
  educationLevel: EducationEnum;
  fieldOfStudy: DomainEnum;
  university: string;
  graduationYear: number;
  
  // Experience
  yearsOfExperience: ExperienceEnum;
  currentPosition?: string;
  currentCompany?: string;
  
  // Skills & Languages
  skills: string[];
  languages: {
    name: string;
    level: 'Native' | 'Fluent' | 'Intermediate';
  }[];
  
  // Profile
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
};

type Company = {
  id: string;
  companyName: string;
  activityDomain: DomainEnum;
  professionalEmail: string;
  phoneNumber: string;
  website?: string;
  
  // Location
  wilaya: WilayaEnum;
  postalCode: string;
  
  // Description
  description: string;
  
  // Documents
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
  
  // Admin Account
  adminFullName: string;
  adminEmail: string;
  password: string; // hashed
  
  // Status
  status: CompanyStatusEnum;
  registrationDate: Date;
  approvedDate?: Date;
  approvedBy?: string; // Admin ID
  
  // Stats
  jobOffersCount: number;
  totalApplications: number;
  acceptedCandidates: number;
  
  createdAt: Date;
  updatedAt: Date;
};

type JobOffer = {
  id: string;
  companyId: string;
  
  // Job Info
  jobTitle: string;
  jobDescription: string;
  requirements: string[];
  responsibilities: string[];
  
  // Details
  contractType: ContractEnum;
  domain: DomainEnum;
  wilaya: WilayaEnum;
  postalCode: string;
  salaryRange: SalaryEnum;
  experienceRequired: ExperienceEnum;
  
  // Application Settings
  maxAcceptedCandidates: number;
  currentAccepted: number;
  requireQCMTest: boolean;
  linkedTestId?: string;
  
  // Meta
  status: 'Active' | 'Closed';
  postedDate: Date;
  applicationsCount: number;
  
  createdAt: Date;
  updatedAt: Date;
};

type Application = {
  id: string;
  candidateId: string;
  jobId: string;
  companyId: string;
  
  appliedDate: Date;
  currentStatus: ApplicationStatusEnum;
  
  // AI Matching
  compatibilityScore: number; // 0-100
  
  // Test
  testStatus?: TestStatusEnum;
  testScore?: number;
  testCompletedAt?: Date;
  
  // Company Decision
  decision?: 'Accept' | 'Reject';
  decisionDate?: Date;
  comments?: string;
  
  createdAt: Date;
  updatedAt: Date;
};

type Test = {
  id: string;
  companyId: string;
  jobOfferId?: string;
  
  testName: string;
  domain: DomainEnum;
  description: string;
  
  // Configuration
  duration: number; // minutes
  passingScore: number; // percentage
  numberOfQuestions: number;
  
  // Questions
  questions: {
    id: string;
    questionText: string;
    questionType: 'multiple_choice';
    options: {
      id: 'A' | 'B' | 'C' | 'D';
      text: string;
      isCorrect: boolean;
    }[];
    attachedMedia?: {
      type: 'image' | 'video';
      url: string;
    };
  }[];
  
  createdAt: Date;
  updatedAt: Date;
};

type Training = {
  id: string;
  companyId: string;
  jobOfferId?: string;
  
  title: string;
  domain: DomainEnum;
  description: string;
  position?: string;
  
  // Content
  totalVideos: number;
  totalCourses: number;
  totalHours: number;
  
  modules: {
    moduleId: string;
    moduleTitle: string;
    lessons: {
      lessonId: string;
      title: string;
      type: 'video' | 'text' | 'quiz';
      duration: number;
      videoUrl?: string;
      content?: string;
    }[];
  }[];
  
  createdAt: Date;
  updatedAt: Date;
};

type CandidateTrainingProgress = {
  id: string;
  candidateId: string;
  trainingId: string;
  
  progress: number; // 0-100
  completedLessons: string[]; // lessonIds
  startedAt: Date;
  completedAt?: Date;
  
  updatedAt: Date;
};
```

---

## 9. User Flows

### 9.1 Candidate Journey

```
1. Registration
   → Fill form → Submit → Email verification (optional) → Login

2. Profile Setup
   → Complete profile → Upload CV (optional) → Add skills → Save

3. Job Discovery
   → Browse jobs / Search → View details → Check match % → Save or Apply

4. Application
   → Click Apply → [If test required: Take test → Wait for results] → Submit

5. Test Taking (if required)
   → Start test → Answer questions → Submit → View score → Pass/Fail

6. Wait for Decision
   → Monitor dashboard → Check status → Receive notification

7. Acceptance
   → Review offer → Accept → Access training → Complete onboarding

8. Training
   → View modules → Watch videos → Complete quizzes → Track progress
```

### 9.2 Company Journey

```
1. Registration
   → Fill company info → Upload documents → Create admin account → Submit

2. Waiting for Approval
   → Admin reviews → [Request more info OR Approve OR Reject]

3. Approval
   → Receive notification → Login → Access dashboard

4. Job Posting
   → Create job offer → Set requirements → [Link test if needed] → Publish

5. Application Review
   → View applicants → Check compatibility → Review test scores → Filter

6. Candidate Evaluation
   → View candidate detail → Read AI summary → Check test results → Decide

7. Decision Making
   → Accept/Reject → Add comments → Notify candidate

8. Onboarding
   → Accepted candidates → Assign training → Monitor progress
```

### 9.3 Admin Journey

```
1. Login
   → Super admin credentials → Access admin panel

2. Company Verification
   → View pending companies → Check documents → Review info → Decide

3. Platform Monitoring
   → View analytics → Check activity → Monitor stats

4. User Management
   → View all users → Suspend/Activate → Resolve issues

5. Content Moderation
   → Review job offers → Check applications → Ensure quality
```

---

## 10. Animation Guidelines

### 10.1 Framer Motion Usage

#### Page Transitions
```javascript
// Layout transition
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// Apply to page wrapper
<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  variants={pageVariants}
  transition={pageTransition}
>
  {children}
</motion.div>
```

#### Card Hover Effects
```javascript
const cardVariants = {
  rest: { scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: { duration: 0.3 }
  }
};

<motion.div
  variants={cardVariants}
  initial="rest"
  whileHover="hover"
  className="job-card"
>
  {/* Card content */}
</motion.div>
```

#### Stagger Children Animation
```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={containerVariants} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### Button Interactions
```javascript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="primary-button"
>
  Apply Now
</motion.button>
```

### 10.2 GSAP Usage

#### Hero Section Entrance
```javascript
useEffect(() => {
  const tl = gsap.timeline();
  
  tl.from('.hero-title', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
  })
  .from('.hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero-cta', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power3.out'
  }, '-=0.4');
}, []);
```

#### Scroll-Triggered Animations
```javascript
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.features-section',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 60,
    stagger: 0.2,
    duration: 1,
    ease: 'power3.out'
  });
}, []);
```

#### Counter Animation
```javascript
useEffect(() => {
  gsap.to('.stat-number', {
    textContent: targetValue,
    duration: 2,
    ease: 'power1.inOut',
    snap: { textContent: 1 },
    scrollTrigger: {
      trigger: '.stats-section',
      start: 'top 80%'
    }
  });
}, [targetValue]);
```

### 10.3 Animation Principles

1. **Performance First**
   - Use `transform` and `opacity` for animations
   - Avoid animating `width`, `height`, `top`, `left`
   - Use `will-change` sparingly

2. **Duration Guidelines**
   - Micro-interactions: 150-300ms
   - Page transitions: 400-600ms
   - Complex sequences: 800-1200ms

3. **Easing Functions**
   - Entrance: `ease-out` or `power3.out`
   - Exit: `ease-in` or `power3.in`
   - Both: `ease-in-out` or `power3.inOut`

4. **Accessibility**
   - Respect `prefers-reduced-motion`
   - Provide instant alternatives
   - Don't rely solely on animation for feedback

```javascript
// Respect user preferences
const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const transition = shouldReduceMotion 
  ? { duration: 0 }
  : { duration: 0.5, ease: 'easeInOut' };
```

---

## 11. Development Phases

### Phase 1: Foundation (Week 1-2)
**Goal:** Setup project structure and core layouts

**Tasks:**
1. Next.js project initialization
2. Install dependencies (Tailwind, shadcn, Aceternity, GSAP, Framer Motion)
3. Setup folder structure
4. Create design system (colors, typography, components)
5. Build layout components (Header, Footer, Sidebar)
6. Implement routing structure

**Deliverables:**
- ✅ Project skeleton
- ✅ Design tokens
- ✅ Reusable components
- ✅ Navigation system

---

### Phase 2: Public Pages (Week 3)
**Goal:** Complete public-facing pages

**Tasks:**
1. Homepage
   - Hero section with animations
   - Features grid
   - How It Works timeline
   - CTA sections
2. About page
3. Login/Register modals or pages

**Deliverables:**
- ✅ Fully functional homepage
- ✅ About page
- ✅ Authentication UI (no backend)

---

### Phase 3: Candidate Portal (Week 4-5)
**Goal:** Build complete candidate experience

**Tasks:**
1. Candidate registration flow
2. Dashboard
3. Profile page (view + edit)
4. Job search interface with filters
5. Job details page
6. Application system UI
7. Tests interface
8. Training modules UI
9. Settings page

**Deliverables:**
- ✅ Full candidate portal
- ✅ Job search & filtering
- ✅ Test-taking interface
- ✅ Training system

---

### Phase 4: Company Portal (Week 6-7)
**Goal:** Build complete company experience

**Tasks:**
1. Company registration (3-step form)
2. Company dashboard
3. Company profile
4. Create job offer form
5. Job offers management
6. Applicants list
7. Recruitment management (candidate review)
8. Create test form
9. Create training form
10. Company settings

**Deliverables:**
- ✅ Full company portal
- ✅ Job management system
- ✅ Applicant review system
- ✅ Test/training creation

---

### Phase 5: Super Admin Panel (Week 8-9)
**Goal:** Build complete admin experience

**Tasks:**
1. Admin dashboard
2. Analytics page with charts
3. Companies list
4. Company approval flow
5. Company detail page
6. Candidates list
7. Users management
8. Job offers management
9. Applications overview
10. Platform settings

**Deliverables:**
- ✅ Full admin panel
- ✅ Analytics dashboard
- ✅ Company verification system
- ✅ User management

---

### Phase 6: Polish & Optimization (Week 10)
**Goal:** Refine UX and optimize performance

**Tasks:**
1. Add all animations (Framer Motion + GSAP)
2. Implement loading states
3. Add error handling UI
4. Responsive design adjustments
5. Performance optimization
6. Accessibility improvements
7. Cross-browser testing
8. Code cleanup

**Deliverables:**
- ✅ Polished animations
- ✅ Responsive design
- ✅ Optimized performance
- ✅ Production-ready code

---

## 12. Performance Requirements

### 12.1 Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### 12.2 Optimization Strategies

#### Image Optimization
```javascript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/company-logo.jpg"
  alt="Company Logo"
  width={200}
  height={200}
  priority={isAboveFold}
  placeholder="blur"
/>
```

#### Code Splitting
```javascript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Spinner />,
  ssr: false
});
```

#### Font Optimization
```javascript
// Use next/font
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});
```

#### Bundle Analysis
```bash
# Run bundle analyzer
npm run build
npm run analyze
```

### 12.3 Caching Strategy
- Static pages: Cache indefinitely
- Dynamic data: Revalidate every 60s (ISR)
- User-specific data: No cache (CSR)

---

## 13. File Structure

```
cvision/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       ├── candidate/
│   │       │   └── page.tsx
│   │       └── company/
│   │           └── page.tsx
│   ├── (public)/
│   │   ├── page.tsx (Homepage)
│   │   └── about/
│   │       └── page.tsx
│   ├── (candidate)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── tests/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── training/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── (company)/
│   │   ├── company/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── create/
│   │   │   │       └── page.tsx
│   │   │   ├── applicants/
│   │   │   │   └── page.tsx
│   │   │   ├── recruitment/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── tests/
│   │   │   │   └── create/
│   │   │   │       └── page.tsx
│   │   │   ├── training/
│   │   │   │   └── create/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   └── (admin)/
│       └── admin/
│           ├── layout.tsx
│           ├── dashboard/
│           │   └── page.tsx
│           ├── analytics/
│           │   └── page.tsx
│           ├── companies/
│           │   ├── page.tsx
│           │   ├── approval/
│           │   │   └── [id]/
│           │   │       └── page.tsx
│           │   └── [id]/
│           │       └── page.tsx
│           ├── candidates/
│           │   └── page.tsx
│           ├── users/
│           │   └── page.tsx
│           ├── jobs/
│           │   └── page.tsx
│           ├── applications/
│           │   └── page.tsx
│           └── settings/
│               └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── DashboardLayout.tsx
│   ├── shared/
│   │   ├── JobCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── MatchScore.tsx
│   │   └── ...
│   └── animations/
│       ├── PageTransition.tsx
│       ├── StaggerContainer.tsx
│       └── ...
├── lib/
│   ├── constants/
│   │   ├── wilayas.ts
│   │   ├── domains.ts
│   │   └── enums.ts
│   ├── utils/
│   │   ├── cn.ts (classnames utility)
│   │   ├── format.ts
│   │   └── validators.ts
│   └── animations/
│       ├── variants.ts
│       └── timelines.ts
├── types/
│   ├── candidate.ts
│   ├── company.ts
│   ├── job.ts
│   └── index.ts
├── public/
│   ├── images/
│   └── icons/
└── styles/
    └── globals.css
```

---

## 14. Component Guidelines

### 14.1 shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add toast
```

### 14.2 Aceternity UI Integration

```javascript
// Example: Using Aceternity's animated components
import { HeroHighlight } from '@/components/aceternity/hero-highlight';
import { BentoGrid } from '@/components/aceternity/bento-grid';
import { FloatingNav } from '@/components/aceternity/floating-nav';

// Apply to homepage hero
<HeroHighlight>
  <h1>Connecting Job Seekers and Companies in Algeria</h1>
</HeroHighlight>
```

**Note:** Aceternity UI components should be used for:
- Hero sections (animated backgrounds)
- Feature grids (Bento Grid)
- Navigation (Floating Nav)
- Cards with parallax effects
- Testimonial sections

### 14.3 Custom Components to Build

#### StatusBadge
```typescript
interface StatusBadgeProps {
  status: 'Accepted' | 'Pending' | 'Rejected';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const styles = {
    Accepted: 'bg-[#CCF4EA] text-[#00C897]',
    Pending: 'bg-[#FFF3CD] text-[#FFC107]',
    Rejected: 'bg-[#FDEDEB] text-[#E74C3C]'
  };
  
  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-sm font-medium',
      styles[status],
      className
    )}>
      {status}
    </span>
  );
};
```

#### MatchScore
```typescript
interface MatchScoreProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

const MatchScore: React.FC<MatchScoreProps> = ({ score, size = 'md' }) => {
  const getColor = (score: number) => {
    if (score >= 85) return '#00C897';
    if (score >= 70) return '#FFC107';
    return '#9CA3AF';
  };
  
  return (
    <div className="flex items-center gap-2">
      <svg width={size === 'lg' ? 60 : size === 'md' ? 48 : 36} height={size === 'lg' ? 60 : size === 'md' ? 48 : 36}>
        {/* Circular progress SVG */}
      </svg>
      <span className="font-bold" style={{ color: getColor(score) }}>
        {score}% Match
      </span>
    </div>
  );
};
```

---

## 15. Mock Data Strategy

Since this is frontend-only, create mock data files for development:

```typescript
// lib/mock-data/jobs.ts
export const mockJobs = [
  {
    id: '1',
    jobTitle: 'Senior PHP Developer',
    companyName: 'Tech Solutions Inc.',
    companyLogo: '/logos/tech-solutions.png',
    location: 'Algiers',
    salaryRange: '100,000 - 200,000 DA',
    contractType: 'CDI',
    domain: 'IT & Software',
    postedDate: new Date('2024-07-20'),
    matchPercentage: 88,
    applicationsCount: 45,
    saved: false
  },
  // ... more mock jobs
];

// lib/mock-data/candidates.ts
export const mockCandidates = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    // ... full candidate data
  },
  // ... more mock candidates
];

// Similar files for companies, applications, tests, etc.
```

**Usage:**
```typescript
// In your component
import { mockJobs } from '@/lib/mock-data/jobs';

export default function JobsPage() {
  const [jobs, setJobs] = useState(mockJobs);
  
  // Component logic
}
```

---

## 16. Testing Checklist

### 16.1 Functional Testing
- [ ] All forms validate correctly
- [ ] Navigation works across all pages
- [ ] Filters apply correctly
- [ ] Status badges display correct colors
- [ ] Match percentages calculate (mock)
- [ ] Multi-step forms progress correctly
- [ ] File upload UI works (mock)

### 16.2 Visual Testing
- [ ] Design system colors applied correctly
- [ ] Typography hierarchy is clear
- [ ] Spacing is consistent
- [ ] Components align with design
- [ ] Icons are appropriate size
- [ ] Images load and display correctly

### 16.3 Responsive Testing
- [ ] Mobile (375px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1920px+)

### 16.4 Animation Testing
- [ ] Page transitions smooth
- [ ] Hover effects work
- [ ] GSAP animations trigger correctly
- [ ] Scroll animations perform well
- [ ] No animation jank
- [ ] Reduced motion respected

### 16.5 Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Screen reader friendly
- [ ] Forms properly labeled

### 16.6 Performance Testing
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Images optimized
- [ ] Code split appropriately
- [ ] No console errors
- [ ] Fast page loads

### 16.7 Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 17. Deployment Preparation

### 17.1 Environment Setup
```bash
# .env.local (for development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://api.cvision.dz (when backend ready)
```

### 17.2 Build Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cvision.dz', 'storage.cvision.dz'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
```

### 17.3 Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Recommended Settings:**
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

---

## 18. Future Backend Integration Points

When backend is ready, these are the key integration points:

### 18.1 Authentication
```typescript
// Replace mock with real auth
import { signIn, signOut, useSession } from 'next-auth/react';

// API routes
POST /api/auth/register/candidate
POST /api/auth/register/company
POST /api/auth/login
POST /api/auth/logout
```

### 18.2 Data Fetching
```typescript
// Replace mock data with API calls
import useSWR from 'swr';

const { data, error, isLoading } = useSWR('/api/jobs', fetcher);
```

### 18.3 API Endpoints Needed
```
Candidates:
- GET    /api/candidates
- GET    /api/candidates/:id
- POST   /api/candidates
- PUT    /api/candidates/:id
- DELETE /api/candidates/:id

Companies:
- GET    /api/companies
- GET    /api/companies/:id
- POST   /api/companies
- PUT    /api/companies/:id
- DELETE /api/companies/:id

Jobs:
- GET    /api/jobs
- GET    /api/jobs/:id
- POST   /api/jobs
- PUT    /api/jobs/:id
- DELETE /api/jobs/:id

Applications:
- GET    /api/applications
- GET    /api/applications/:id
- POST   /api/applications
- PUT    /api/applications/:id
- DELETE /api/applications/:id

Tests:
- GET    /api/tests
- GET    /api/tests/:id
- POST   /api/tests
- POST   /api/tests/:id/submit

Admin:
- GET    /api/admin/analytics
- GET    /api/admin/companies/pending
- PUT    /api/admin/companies/:id/approve
- PUT    /api/admin/companies/:id/reject
```

---

## 19. AI Integration Points (Future)

### 19.1 CV Analysis
```typescript
// Mock for now, will integrate with AI service
interface CVAnalysisResult {
  extractedSkills: string[];
  experienceYears: number;
  education: string;
  suggestedJobs: string[];
}

// Future endpoint
POST /api/ai/analyze-cv
Body: { cvFile: File }
Response: CVAnalysisResult
```

### 19.2 Job Matching
```typescript
// Mock matching algorithm
function calculateMatch(candidate, job): number {
  // Simple mock: return random 60-95
  return Math.floor(Math.random() * 35) + 60;
}

// Future: AI-powered matching
POST /api/ai/match
Body: { candidateId, jobId }
Response: { score: number, reasons: string[] }
```

---

## 20. Glossary

- **CDI:** Contrat à Durée Indéterminée (Permanent Contract)
- **CDD:** Contrat à Durée Déterminée (Fixed-Term Contract)
- **QCM:** Questions à Choix Multiples (Multiple Choice Questions)
- **RC:** Registre de Commerce (Commercial Register)
- **NIF:** Numéro d'Identification Fiscale (Tax Identification Number)
- **Wilaya:** Administrative division in Algeria (similar to province/state)
- **DA:** Algerian Dinar (currency)

---

## 21. References & Resources

### 21.1 Design Inspiration
- https://ui.shadcn.com
- https://ui.aceternity.com
- https://dribbble.com/tags/recruitment-platform

### 21.2 Technical Documentation
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion
- GSAP: https://greensock.com/docs
- shadcn/ui: https://ui.shadcn.com

### 21.3 Algerian Context
- List of Wilayas: https://en.wikipedia.org/wiki/Provinces_of_Algeria
- Postal Codes: https://www.codepostal.dz
- Labor Laws: (Research Algerian employment regulations)

---

## 22. Contact & Support

**Project Owner:** [Your Name]  
**Email:** [Your Email]  
**Project Start Date:** February 15, 2026  
**Expected Completion:** May 2026 (10 weeks)

---

## 23. Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Feb 15, 2026 | Initial PRD | AI Assistant |

---

## 24. Acceptance Criteria

### Phase Completion Criteria:

**Phase 1 Complete When:**
- [ ] All dependencies installed
- [ ] Design system implemented
- [ ] Routing works
- [ ] Basic components built

**Phase 2 Complete When:**
- [ ] Homepage fully animated
- [ ] About page complete
- [ ] Auth UI implemented
- [ ] All public pages responsive

**Phase 3 Complete When:**
- [ ] Candidate can register
- [ ] Dashboard displays data
- [ ] Jobs can be searched/filtered
- [ ] Application flow works
- [ ] Tests can be taken
- [ ] Training accessible

**Phase 4 Complete When:**
- [ ] Company can register
- [ ] Jobs can be created
- [ ] Applicants can be reviewed
- [ ] Tests/training can be created
- [ ] All company features work

**Phase 5 Complete When:**
- [ ] Admin dashboard complete
- [ ] Analytics display
- [ ] Company approval works
- [ ] All management features work

**Phase 6 Complete When:**
- [ ] All animations smooth
- [ ] Fully responsive
- [ ] Performance optimized
- [ ] No console errors
- [ ] Ready for production

---

## 25. Success Metrics

### Development Metrics:
- Code completion: 100%
- Component coverage: 100%
- Pages implemented: 30+
- Zero critical bugs

### Performance Metrics:
- Lighthouse score: > 90
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### Quality Metrics:
- TypeScript coverage: 100%
- Responsive: All breakpoints
- Accessibility: WCAG AA
- Browser support: Modern browsers

---

**END OF PRD**

---

This PRD is ready to be used with AI development assistants like Claude, GitHub Copilot, or Context 7 for rapid, high-quality frontend development.
