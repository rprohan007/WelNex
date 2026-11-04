export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LessonStatus = 'Unread' | 'In Progress' | 'Completed';

export interface NumericalExampleCard {
  id: string;
  title: string;
  subtitle?: string;
  inputs: { label: string; value: string }[];
  calculationSteps: string[];
  finalResult: { label: string; value: string; note?: string };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface LessonContentSection {
  id: string;
  heading: string;
  paragraphs: string[];
  calloutNote?: {
    type: 'tip' | 'warning' | 'info' | 'key-takeaway';
    title: string;
    text: string;
  };
  bulletPoints?: string[];
}

export interface ChapterResource {
  id: string;
  title: string;
  fileType: 'pdf' | 'ppt' | 'pptx';
  fileUrl: string; // URL link or base64 data URL
  fileSize?: string;
  description?: string;
}

export interface SubTopic {
  id: string;
  topicId: string;
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  estimatedReadingTime: string;
  durationMinutes: number;
  summary: string;
  order: number;
  contentSections: LessonContentSection[];
  numericalExamples?: NumericalExampleCard[];
  quizQuestions?: QuizQuestion[];
  resources?: ChapterResource[];
  documentUrl?: string;
  slidesUrl?: string;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  category: string; // 'Foundations' | 'REITs' | 'SM REITs' | 'InvITs' | 'AIFs' | 'Private Credit' | 'Bonds'
  description: string;
  iconName?: string;
  order: number;
  subTopics: SubTopic[];
}

export interface AcademyStats {
  totalTopics: number;
  totalSubTopics: number;
  completedSubTopics: number;
  progressPercentage: number;
  totalEstimatedMinutes: number;
  remainingMinutes: number;
}
