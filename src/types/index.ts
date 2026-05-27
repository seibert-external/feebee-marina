export type Role = 'hr' | 'employee';

export type ProcessType =
  | 'onboarding'
  | 'high-potential'
  | 'peer-feedback'
  | 'performance-improvement'
  | 'custom';

export type ProcessStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  manager: string;
  startDate: string;
}

export interface FeedbackProcess {
  id: string;
  title: string;
  type: ProcessType;
  status: ProcessStatus;
  targetEmployee: string;
  participants: string[];
  startDate: string;
  endDate: string;
  completedCount: number;
  totalCount: number;
  aiSummary?: string;
  questions: FeedbackQuestion[];
  includesSelfAssessment?: boolean;
  selfAssessmentTemplateId?: string;
  stage?: number;
  previousProcessId?: string;
  approvedForEmployee?: boolean;
}

export interface FeedbackQuestion {
  id: string;
  text: string;
  type: 'rating' | 'text' | 'competency';
  category?: string;
  required: boolean;
  aiSuggested?: boolean;
  basedOnPrevious?: string;
}

export interface FeedbackResponse {
  id: string;
  processId: string;
  fromEmployee: string;
  toEmployee: string;
  date: string;
  status: 'pending' | 'completed';
  isSelfAssessment?: boolean;
  approvedByHR?: boolean;
  answers: FeedbackAnswer[];
}

export interface FeedbackAnswer {
  questionId: string;
  rating?: number;
  text?: string;
}

export interface FeedbackTemplate {
  id: string;
  name: string;
  type: ProcessType | 'self-assessment' | 'short-feedback' | 'proactive';
  description: string;
  questions: FeedbackQuestion[];
  aiSuggestionsEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DevelopmentData {
  employeeId: string;
  competencies: CompetencyWithSelf[];
  timeline: TimelineEntry[];
  recommendations: Recommendation[];
  strengths: string[];
  developmentAreas: string[];
  aiComparisonInsight?: string;
}

export interface Competency {
  name: string;
  current: number;
  previous: number;
  max: number;
}

export interface CompetencyWithSelf extends Competency {
  selfAssessment: number;
}

export interface TimelineEntry {
  date: string;
  event: string;
  type: 'feedback' | 'training' | 'milestone' | 'goal';
  details?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  interested?: boolean;
}

export interface AnalyticsData {
  teamSentiment: { month: string; score: number }[];
  completionRates: { department: string; rate: number }[];
  feedbackTrends: { month: string; given: number; received: number }[];
  topStrengths: { skill: string; count: number }[];
  topDevelopmentAreas: { skill: string; count: number }[];
  aiInsights: string[];
}

export interface CyclicFeedbackConfig {
  id: string;
  teamName: string;
  department: string;
  members: string[];
  frequency: 'monthly' | 'quarterly' | 'yearly';
  templateId: string;
  startDate: string;
  rotationSchedule: { month: string; from: string; to: string }[];
  active: boolean;
  yearEndReport?: boolean;
  criticalFeedbackAlert?: boolean;
}

export interface PeerFeedbackRequest {
  id: string;
  fromEmployee: string;
  toEmployee: string;
  templateId: string;
  type: 'request' | 'proactive';
  status: 'pending' | 'completed';
  shareDirectly: boolean;
  message?: string;
  date: string;
  feedback?: FeedbackAnswer[];
}

export interface AIWarning {
  id: string;
  processId: string;
  employeeId: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestedAction: string;
  actionType: 'email' | 'jira' | 'meeting' | 'review';
  resolved: boolean;
  date: string;
}

export interface HighPotential {
  employeeId: string;
  score: number;
  indicators: string[];
  recommendation: string;
  identifiedDate: string;
}

export interface DevelopmentInterest {
  employeeId: string;
  recommendationId: string;
  title: string;
  category: string;
  requestedDate: string;
  status: 'requested' | 'approved' | 'in-progress' | 'completed';
}

export interface SkillDistribution {
  skill: string;
  team: number;
  department: number;
  company: number;
  level: 'low' | 'medium' | 'high';
}
