export const WilayaEnum = {
  ADRAR: "Adrar",
  CHLEF: "Chlef",
  LAGHOUAT: "Laghouat",
  OUM_EL_BOUAGHI: "Oum El Bouaghi",
  BATNA: "Batna",
  BEJAIA: "Béjaïa",
  BISKRA: "Biskra",
  BECHAR: "Béchar",
  BLIDA: "Blida",
  BOUIRA: "Bouira",
  TAMANRASSET: "Tamanrasset",
  TEBESSA: "Tébessa",
  TLEMCEN: "Tlemcen",
  TIARET: "Tiaret",
  TIZI_OUZOU: "Tizi Ouzou",
  ALGIERS: "Algiers",
  DJELFA: "Djelfa",
  JIJEL: "Jijel",
  SETIF: "Sétif",
  SAIDA: "Saïda",
  SKIKDA: "Skikda",
  SIDI_BEL_ABBES: "Sidi Bel Abbès",
  ANNABA: "Annaba",
  GUELMA: "Guelma",
  CONSTANTINE: "Constantine",
  MEDEA: "Médéa",
  MOSTAGANEM: "Mostaganem",
  MSILA: "M'Sila",
  MASCARA: "Mascara",
  OUARGLA: "Ouargla",
  ORAN: "Oran",
  EL_BAYADH: "El Bayadh",
  ILLIZI: "Illizi",
  BORDJ_BOU_ARRERIDJ: "Bordj Bou Arréridj",
  BOUMERDES: "Boumerdès",
  EL_TARF: "El Tarf",
  TINDOUF: "Tindouf",
  TISSEMSILT: "Tissemsilt",
  EL_OUED: "El Oued",
  KHENCHELA: "Khenchela",
  SOUK_AHRAS: "Souk Ahras",
  TIPAZA: "Tipaza",
  MILA: "Mila",
  AIN_DEFLA: "Aïn Defla",
  NAAMA: "Naâma",
  AIN_TEMOUCHENT: "Aïn Témouchent",
  GHARDAIA: "Ghardaïa",
  RELIZANE: "Relizane",
  TIMIMOUN: "Timimoun",
  BORDJ_BADJI_MOKHTAR: "Bordj Badji Mokhtar",
  OULED_DJELLAL: "Ouled Djellal",
  BENI_ABBES: "Béni Abbès",
  IN_SALAH: "In Salah",
  IN_GUEZZAM: "In Guezzam",
  TOUGGOURT: "Touggourt",
  DJANET: "Djanet",
  EL_MEGHAIER: "El Meghaier",
  EL_MENIAA: "El Meniaa",
} as const;

export type WilayaEnum = (typeof WilayaEnum)[keyof typeof WilayaEnum];

export const DomainEnum = {
  IT_SOFTWARE: "IT & Software",
  HEALTHCARE: "Healthcare",
  ENGINEERING: "Engineering",
  EDUCATION: "Education",
  BUSINESS_MANAGEMENT: "Business & Management",
  MARKETING: "Marketing",
  FINANCE: "Finance",
  LAW: "Law",
  ARTS_MEDIA: "Arts & Media",
  CONSTRUCTION: "Construction",
  TRANSPORTATION: "Transportation",
  HOSPITALITY_TOURISM: "Hospitality & Tourism",
} as const;

export type DomainEnum = (typeof DomainEnum)[keyof typeof DomainEnum];

export const EducationEnum = {
  HIGH_SCHOOL: "High School Diploma",
  BACHELORS: "Bachelor's Degree",
  MASTERS: "Master's Degree",
  MAGISTER: "Magister Degree",
  PHD: "PhD (Doctoral Degree)",
} as const;

export type EducationEnum = (typeof EducationEnum)[keyof typeof EducationEnum];

export const ExperienceEnum = {
  ENTRY: "0-1 years (Entry Level)",
  JUNIOR: "2-5 years",
  MID: "5-10 years",
  SENIOR: "10+ years",
} as const;

export type ExperienceEnum =
  (typeof ExperienceEnum)[keyof typeof ExperienceEnum];

export const SalaryEnum = {
  RANGE_1: "0 - 50,000 DA",
  RANGE_2: "50,000 - 100,000 DA",
  RANGE_3: "100,000 - 200,000 DA",
  RANGE_4: "200,000 + DA",
} as const;

export type SalaryEnum = (typeof SalaryEnum)[keyof typeof SalaryEnum];

export const ContractEnum = {
  CDI: "CDI",
  CDD: "CDD",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
} as const;

export type ContractEnum = (typeof ContractEnum)[keyof typeof ContractEnum];

export const ApplicationStatusEnum = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
} as const;

export type ApplicationStatusEnum =
  (typeof ApplicationStatusEnum)[keyof typeof ApplicationStatusEnum];

export const CompanyStatusEnum = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export type CompanyStatusEnum =
  (typeof CompanyStatusEnum)[keyof typeof CompanyStatusEnum];

export const TestStatusEnum = {
  NOT_STARTED: "Not Started",
  COMPLETED: "Completed",
  PASSED: "Passed",
  FAILED: "Failed",
} as const;

export type TestStatusEnum =
  (typeof TestStatusEnum)[keyof typeof TestStatusEnum];
