export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  employer: string;
  location?: string;
  dates: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  dates?: string;
  link?: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  dates?: string;
  details?: string;
}

export interface ResumeData {
  name: string;
  contact: string[];
  professional_summary: string;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: string[];
}

export interface KeywordMatch {
  keyword: string;
  context?: string;
}

export interface KeywordPartial {
  keyword: string;
  note?: string;
}

export interface KeywordMissing {
  keyword: string;
  recommendation?: string;
}

export interface KeywordAnalysis {
  matched: KeywordMatch[];
  partially_matched: KeywordPartial[];
  missing: KeywordMissing[];
}

export interface SuggestedAddition {
  section: string;
  suggestion: string;
  reason: string;
}

export interface TailoredResponse {
  resume: ResumeData;
  keyword_analysis: KeywordAnalysis;
  change_summary: string[];
  suggested_additions?: SuggestedAddition[];
}

export interface JobDetails {
  targetJobTitle: string;
  companyName: string;
  experienceLevel: string;
  desiredLength: string;
  jobDescription: string;
}

export interface UploadedFileState {
  name: string;
  size: number;
  type: string;
  text: string;
  pageCount?: number;
  wordCount?: number;
  status: 'idle' | 'uploading' | 'parsing' | 'ready' | 'error';
  errorMessage?: string;
}
