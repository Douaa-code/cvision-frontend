import type { Candidate } from "@/types";

export const mockCandidate: Candidate = {
  id: "u1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+213 555 123 456",
  wilaya: "Tlemcen",
  postalCode: "13003",
  streetAddress: "123 Rue de la Liberté",
  educationLevel: "Master's Degree",
  fieldOfStudy: "IT & Software",
  university: "University of Algiers",
  graduationYear: 2020,
  yearsOfExperience: "2-5 years",
  currentPosition: "Junior PHP Developer",
  currentCompany: "Company Tech Solutions DZ",
  skills: ["PHP", "MySQL", "JavaScript", "Laravel", "HTML", "CSS", "React", "Git"],
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "French", level: "Fluent" },
    { name: "English", level: "Intermediate" },
  ],
  profilePhoto: undefined,
  createdAt: new Date("2026-01-10"),
  updatedAt: new Date("2026-02-10"),
};
