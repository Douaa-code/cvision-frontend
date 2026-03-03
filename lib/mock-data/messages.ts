export type ChatMessage = {
  id: string;
  sender: "company" | "candidate";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  dateSeparator: string;
  messages: ChatMessage[];
};

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    companyId: "c1",
    companyName: "Tech Company Algeria",
    jobTitle: "Senior PHP Developer",
    candidateId: "u1",
    candidateName: "John Doe",
    dateSeparator: "MONDAY, OCT 24",
    messages: [
      {
        id: "m1",
        sender: "company",
        text: "Hello! Thank you for your application. We'd like to schedule an interview with you.",
        time: "2 days ago",
      },
      {
        id: "m2",
        sender: "candidate",
        text: "Thank you! I'm available this week. What times work best for you?",
        time: "Yesterday",
      },
      {
        id: "m3",
        sender: "company",
        text: "Great! Are you available tomorrow at 2 PM? We can do an online meeting.",
        time: "2:30 PM",
      },
    ],
  },
  {
    id: "conv2",
    companyId: "c2",
    companyName: "Marketing Solutions Dz",
    jobTitle: "Marketing Manager",
    candidateId: "u1",
    candidateName: "John Doe",
    dateSeparator: "TUESDAY, OCT 25",
    messages: [
      {
        id: "m4",
        sender: "company",
        text: "Hi! We reviewed your profile and are very interested in discussing the Marketing Manager position with you.",
        time: "1 day ago",
      },
    ],
  },
  {
    id: "conv3",
    companyId: "c3",
    companyName: "Digital Solutions Dz",
    jobTitle: "Full Stack Developer",
    candidateId: "u1",
    candidateName: "John Doe",
    dateSeparator: "WEDNESDAY, OCT 26",
    messages: [
      {
        id: "m5",
        sender: "company",
        text: "Hello John, we saw your application for the Full Stack Developer role and would love to connect.",
        time: "3 hours ago",
      },
    ],
  },
  {
    id: "conv4",
    companyId: "c4",
    companyName: "Eco-System Partners",
    jobTitle: "Project Manager",
    candidateId: "u1",
    candidateName: "John Doe",
    dateSeparator: "THURSDAY, OCT 27",
    messages: [
      {
        id: "m6",
        sender: "company",
        text: "Hi! We're looking for a Project Manager and your profile caught our attention.",
        time: "1 hour ago",
      },
    ],
  },
];

// Company c1 conversations (for company messages page)
export const mockCompanyConversations: Conversation[] = [
  {
    id: "conv1",
    companyId: "c1",
    companyName: "Tech Company Algeria",
    jobTitle: "Senior PHP Developer",
    candidateId: "u1",
    candidateName: "John Doe",
    dateSeparator: "MONDAY, OCT 24",
    messages: [
      {
        id: "m1",
        sender: "company",
        text: "Hello! Thank you for your application. We'd like to schedule an interview with you.",
        time: "2 days ago",
      },
      {
        id: "m2",
        sender: "candidate",
        text: "Thank you! I'm available this week. What times work best for you?",
        time: "Yesterday",
      },
      {
        id: "m3",
        sender: "company",
        text: "Great! Are you available tomorrow at 2 PM? We can do an online meeting.",
        time: "2:30 PM",
      },
    ],
  },
  {
    id: "conv5",
    companyId: "c1",
    companyName: "Tech Company Algeria",
    jobTitle: "Frontend Developer",
    candidateId: "u2",
    candidateName: "Amina Benali",
    dateSeparator: "TUESDAY, OCT 25",
    messages: [
      {
        id: "m7",
        sender: "company",
        text: "Hello Amina, we're impressed by your portfolio and would like to discuss the Frontend Developer role.",
        time: "2 days ago",
      },
      {
        id: "m8",
        sender: "candidate",
        text: "Thank you for reaching out! I'd love to learn more about the position.",
        time: "1 day ago",
      },
    ],
  },
  {
    id: "conv6",
    companyId: "c1",
    companyName: "Tech Company Algeria",
    jobTitle: "Backend Developer",
    candidateId: "u3",
    candidateName: "Karim Meziane",
    dateSeparator: "WEDNESDAY, OCT 26",
    messages: [
      {
        id: "m9",
        sender: "company",
        text: "Hi Karim! We'd like to invite you for a technical interview for the Backend Developer position.",
        time: "5 hours ago",
      },
    ],
  },
];
