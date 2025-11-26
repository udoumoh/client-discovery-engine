import { ExaResult } from "./exa";

export interface DiscoveryAnswers {
  companyName: string;
  contactRole: string;
  projectName: string;
  currentSituation: string;
  problemOrOpportunity: string;
  targetUsers: string;
  existingSolutions: string;
  constraints: string;
  desiredOutcomes: string;
  mustHaveFeatures: string;
  niceToHaveFeatures: string;
}

export interface DiscoverySummary {
  projectOverview: string;
  goals: string[];
  primaryUserPersona: {
    name: string;
    description: string;
    needs: string[];
    frustrations: string[];
  };
  recommendedFeatures: {
    mustHaves: string[];
    niceToHaves: string[];
  };
  constraintsAndRisks: {
    constraints: string[];
    risks: string[];
    assumptions: string[];
  };
  successMetrics: string[];
  recommendedTracks: ("UX" | "AI" | "Web3")[];
  projectOpportunities: string[];
  suggestedPhases: {
    name: string;
    description: string;
  }[];
  complexityLevel: "Low" | "Medium" | "High";
  estimatedEffortNotes: string;
  openQuestions: string[];
  suggestedNextSteps: string[];
}

export interface ExternalContext {
  companyInsights: ExaResult[];
  problemInsights: ExaResult[];
  marketInsights: ExaResult[];
}

export interface GenerateSummaryResponse {
  clientSummary: DiscoverySummary;
  internalNotes: string;
  researchInsights?: string;
  externalContext?: ExternalContext;
}
