export interface ResumeData {
  personalDetails: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  summary?: string;
  skills?: {
    name: string;
    level: number;
    description?: string;
  }[];
  experience?: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    achievements: string[];
    technologies?: string[];
  }[];
  education?: {
    degree: string;
    university: string;
    startDate: string;
    endDate?: string;
    grade?: string;
    coursework?: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
  }[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}
