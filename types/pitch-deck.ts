// /types/pitch-deck.ts

export type SlideType =
  | 'cover'
  | 'problem'
  | 'solution'
  | 'market'
  | 'product'
  | 'business-model'
  | 'traction'
  | 'team'
  | 'financials'
  | 'ask'
  | 'blank';

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string;
  bullets?: string[];
  chartData?: ChartData;
  imageUrl?: string;
  speakerNotes: string;
  order: number;
}

export interface ChartData {
  type: 'bar' | 'line' | 'area' | 'pie';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface ProjectFormData {
  projectName: string;
  tagline: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  traction: string;
  teamMembers: string;
  fundingAsk: string;
  useOfFunds: string;
}

export interface BrandingConfig {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontChoice: 'tajawal' | 'cairo' | 'almarai';
  templateId: string;
}

export interface PitchDeck {
  id: string;
  projectData: ProjectFormData;
  branding: BrandingConfig;
  slides: Slide[];
  createdAt: Date;
  status: 'draft' | 'generating' | 'ready';
}

export interface GenerateRequest {
  projectData: ProjectFormData;
  documentHighlights?: string;
  colorScheme?: string;
}

export interface GenerateResponse {
  slides: Slide[];
}

export interface DocumentHighlights {
  projectName: string;
  problem: string;
  solution: string;
  highlights: string[];
  financialData: Record<string, string>;
  teamMentions: string[];
  suggestedSlideContent: Record<string, string>;
}
