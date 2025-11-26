import OpenAI from "openai";
import { DiscoveryAnswers, GenerateSummaryResponse } from "@/lib/types";
import { ExaResult } from "@/lib/exa";

// ============================================================================
// Agent Output Type Definitions
// ============================================================================

export interface ResearchOutput {
  companySummary: string;
  competitorSnapshot: string[];
  marketTrends: string[];
  relevantTech: string[];
}

export interface StrategyOutput {
  refinedProjectOverview: string;
  goals: string[];
  projectOpportunities: string[];
  suggestedPhases: {
    name: string;
    description: string;
  }[];
  constraints: string[];
  risks: string[];
  assumptions: string[];
  successMetrics: string[];
  openQuestions: string[];
  suggestedNextSteps: string[];
}

export interface UXOutput {
  primaryUserPersona: {
    name: string;
    description: string;
    needs: string[];
    frustrations: string[];
  };
  uxRecommendations: string[];
  uxRisks: string[];
}

export interface TechOutput {
  complexityLevel: "Low" | "Medium" | "High";
  estimatedEffortNotes: string;
  recommendedTechStack: string[];
  implementationRisks: string[];
}

export interface MultiAgentContext {
  answers: DiscoveryAnswers;
  research: ResearchOutput;
  strategy: StrategyOutput;
  ux: UXOutput;
  tech: TechOutput;
}

// ============================================================================
// Helper: Initialize OpenAI Client
// ============================================================================

function getOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// ============================================================================
// Agent 1: Research Agent
// ============================================================================

export async function runResearchAgent(
  answers: DiscoveryAnswers,
  externalContext: {
    companyInsights: ExaResult[];
    problemInsights: ExaResult[];
    marketInsights: ExaResult[];
  }
): Promise<ResearchOutput> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are a research agent for Lunim Studio. You review discovery answers and external research (already provided) to summarize the company, competitors, market trends, and relevant technologies.

Your output must be strictly valid JSON matching this structure:
{
  "companySummary": "string - 2-3 sentence summary of the company based on their answers and external research",
  "competitorSnapshot": ["array of 3-5 short descriptions of competitors or similar solutions in the space"],
  "marketTrends": ["array of 3-5 relevant market trends that could impact this project"],
  "relevantTech": ["array of 3-5 technologies, frameworks, tools, or approaches that might be relevant"]
}

Be concise but insightful. Focus on actionable intelligence that will inform strategy, UX, and technical decisions.`;

  const userPrompt = `Analyze the following discovery answers and external research to produce a research summary.

Discovery Answers:
${JSON.stringify(answers, null, 2)}

---
EXTERNAL RESEARCH:
---

**Company Insights:**
${
  externalContext.companyInsights.length > 0
    ? externalContext.companyInsights
        .map((r) => `- ${r.title}\n  ${r.snippet}\n  Source: ${r.url}`)
        .join("\n\n")
    : "No additional company information found."
}

**Problem/Opportunity Insights:**
${
  externalContext.problemInsights.length > 0
    ? externalContext.problemInsights
        .map((r) => `- ${r.title}\n  ${r.snippet}\n  Source: ${r.url}`)
        .join("\n\n")
    : "No additional problem/opportunity information found."
}

**Market/User Insights:**
${
  externalContext.marketInsights.length > 0
    ? externalContext.marketInsights
        .map((r) => `- ${r.title}\n  ${r.snippet}\n  Source: ${r.url}`)
        .join("\n\n")
    : "No additional market/user information found."
}

Provide your research summary as valid JSON only.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
  });

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error("No response from OpenAI Research Agent");
  }

  const result: ResearchOutput = JSON.parse(responseContent);

  // Validate structure
  if (
    !result.companySummary ||
    !Array.isArray(result.competitorSnapshot) ||
    !Array.isArray(result.marketTrends) ||
    !Array.isArray(result.relevantTech)
  ) {
    throw new Error("Invalid ResearchOutput structure from OpenAI");
  }

  return result;
}

// ============================================================================
// Agent 2: Strategy Agent
// ============================================================================

export async function runStrategyAgent(
  answers: DiscoveryAnswers,
  research: ResearchOutput
): Promise<StrategyOutput> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are a senior strategy consultant at Lunim. You define goals, opportunities, phases, constraints, risks, assumptions, success metrics, open questions, and next steps.

Your output must be strictly valid JSON matching this structure:
{
  "refinedProjectOverview": "string - concise 2-3 sentence strategic overview of the project",
  "goals": ["array of 3-5 key strategic business goals"],
  "projectOpportunities": ["array of 3-5 specific opportunities or strategic angles Lunim could explore"],
  "suggestedPhases": [
    {
      "name": "string - phase name",
      "description": "string - what happens in this phase"
    }
  ],
  "constraints": ["array of identified constraints"],
  "risks": ["array of potential risks to project success"],
  "assumptions": ["array of key assumptions being made"],
  "successMetrics": ["array of 3-5 measurable, specific success metrics"],
  "openQuestions": ["array of 3-5 important questions that need clarification"],
  "suggestedNextSteps": ["array of 3-5 concrete, actionable next steps"]
}

Be strategic, insightful, and actionable. Think like a senior consultant.`;

  const userPrompt = `Based on the discovery answers and research summary, provide a strategic analysis.

Discovery Answers:
${JSON.stringify(answers, null, 2)}

Research Summary:
${JSON.stringify(research, null, 2)}

Provide your strategic analysis as valid JSON only.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error("No response from OpenAI Strategy Agent");
  }

  const result: StrategyOutput = JSON.parse(responseContent);

  // Validate structure
  if (
    !result.refinedProjectOverview ||
    !Array.isArray(result.goals) ||
    !Array.isArray(result.projectOpportunities) ||
    !Array.isArray(result.suggestedPhases)
  ) {
    throw new Error("Invalid StrategyOutput structure from OpenAI");
  }

  return result;
}

// ============================================================================
// Agent 3: UX Agent
// ============================================================================

export async function runUXAgent(
  answers: DiscoveryAnswers,
  research: ResearchOutput,
  strategy: StrategyOutput
): Promise<UXOutput> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are a senior UX strategist at Lunim. You design personas and UX guidance based on discovery insights, research, and strategic direction.

Your output must be strictly valid JSON matching this structure:
{
  "primaryUserPersona": {
    "name": "string - realistic persona name (e.g., 'Sarah, Product Manager')",
    "description": "string - 2-3 sentences describing the persona's role and context",
    "needs": ["array of 3-5 specific user needs"],
    "frustrations": ["array of 3-5 specific user frustrations or pain points"]
  },
  "uxRecommendations": ["array of 3-5 specific UX recommendations or design principles for this project"],
  "uxRisks": ["array of 2-4 UX-related risks or challenges to watch out for"]
}

Be user-centric and practical. Create a realistic persona that brings the target user to life.`;

  const userPrompt = `Based on the discovery answers, research, and strategy, provide UX guidance.

Discovery Answers:
${JSON.stringify(answers, null, 2)}

Research Summary:
${JSON.stringify(research, null, 2)}

Strategy Summary:
${JSON.stringify(strategy, null, 2)}

Provide your UX analysis as valid JSON only.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error("No response from OpenAI UX Agent");
  }

  const result: UXOutput = JSON.parse(responseContent);

  // Validate structure
  if (
    !result.primaryUserPersona ||
    !result.primaryUserPersona.name ||
    !Array.isArray(result.uxRecommendations) ||
    !Array.isArray(result.uxRisks)
  ) {
    throw new Error("Invalid UXOutput structure from OpenAI");
  }

  return result;
}

// ============================================================================
// Agent 4: Tech Agent
// ============================================================================

export async function runTechAgent(
  answers: DiscoveryAnswers,
  research: ResearchOutput,
  strategy: StrategyOutput
): Promise<TechOutput> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are a senior technical architect at Lunim. You assess feasibility, complexity, effort, and technical stack recommendations.

Your output must be strictly valid JSON matching this structure:
{
  "complexityLevel": "Low | Medium | High - overall project complexity assessment",
  "estimatedEffortNotes": "string - 2-3 sentences about expected effort, team size, timeline considerations, and complexity drivers",
  "recommendedTechStack": ["array of 3-7 specific technologies, frameworks, or tools recommended for this project"],
  "implementationRisks": ["array of 3-5 technical risks or challenges"]
}

Be technical but accessible. Provide practical, actionable technical guidance.`;

  const userPrompt = `Based on the discovery answers, research, and strategy, provide technical assessment and recommendations.

Discovery Answers:
${JSON.stringify(answers, null, 2)}

Research Summary:
${JSON.stringify(research, null, 2)}

Strategy Summary:
${JSON.stringify(strategy, null, 2)}

Provide your technical analysis as valid JSON only.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.6,
  });

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error("No response from OpenAI Tech Agent");
  }

  const result: TechOutput = JSON.parse(responseContent);

  // Validate structure
  if (
    !result.complexityLevel ||
    !result.estimatedEffortNotes ||
    !Array.isArray(result.recommendedTechStack) ||
    !Array.isArray(result.implementationRisks)
  ) {
    throw new Error("Invalid TechOutput structure from OpenAI");
  }

  return result;
}

// ============================================================================
// Agent 5: Synthesizer Agent
// ============================================================================

export async function runSynthesizerAgent(
  ctx: MultiAgentContext
): Promise<GenerateSummaryResponse> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are a synthesis layer that takes outputs from multiple specialist agents and produces a single, cohesive project discovery summary for Lunim's Discovery Assistant.

You must produce valid JSON matching this EXACT structure:

{
  "clientSummary": {
    "projectOverview": "string - concise 2-3 sentence overview",
    "goals": ["array of 3-5 key strategic project goals"],
    "primaryUserPersona": {
      "name": "string - realistic persona name",
      "description": "string - 2-3 sentences describing the persona",
      "needs": ["array of 3-5 specific user needs"],
      "frustrations": ["array of 3-5 specific user frustrations"]
    },
    "recommendedFeatures": {
      "mustHaves": ["array of essential features for MVP/launch"],
      "niceToHaves": ["array of valuable but non-critical features"]
    },
    "constraintsAndRisks": {
      "constraints": ["array of identified constraints"],
      "risks": ["array of potential risks"],
      "assumptions": ["array of key assumptions"]
    },
    "successMetrics": ["array of 3-5 measurable metrics"],
    "recommendedTracks": ["array containing one or more of: UX, AI, Web3"],
    "projectOpportunities": ["array of 3-5 specific opportunities"],
    "suggestedPhases": [
      {
        "name": "string - phase name",
        "description": "string - what happens in this phase"
      }
    ],
    "complexityLevel": "Low | Medium | High",
    "estimatedEffortNotes": "string - 2-3 sentences about effort",
    "openQuestions": ["array of 3-5 important questions"],
    "suggestedNextSteps": ["array of 3-5 concrete steps"]
  },
  "internalNotes": "string - detailed internal notes for the Lunim team including strategic recommendations, upsell opportunities, technical considerations, team composition suggestions, and any red flags or concerns",
  "researchInsights": "string - summary of key insights from research and how they informed the analysis"
}

Your job is to synthesize the specialized outputs into a coherent, comprehensive discovery summary. Use the research insights, strategic analysis, UX guidance, and technical assessment to inform all sections.

For recommendedTracks, select from ["UX", "AI", "Web3"] based on:
- UX: User experience design, interface design, usability, research
- AI: Machine learning, NLP, intelligent automation, AI features
- Web3: Blockchain, crypto, NFTs, decentralized apps, smart contracts`;

  const userPrompt = `Synthesize the following specialist outputs into a comprehensive discovery summary.

Original Discovery Answers:
${JSON.stringify(ctx.answers, null, 2)}

Research Agent Output:
${JSON.stringify(ctx.research, null, 2)}

Strategy Agent Output:
${JSON.stringify(ctx.strategy, null, 2)}

UX Agent Output:
${JSON.stringify(ctx.ux, null, 2)}

Tech Agent Output:
${JSON.stringify(ctx.tech, null, 2)}

IMPORTANT:
- Use the strategy agent's refinedProjectOverview for clientSummary.projectOverview
- Use the strategy agent's goals for clientSummary.goals
- Use the UX agent's primaryUserPersona directly for clientSummary.primaryUserPersona
- Extract mustHaves from the answers' mustHaveFeatures and niceToHaves from niceToHaveFeatures
- Combine constraints, risks, and assumptions from the strategy agent
- Use the strategy agent's successMetrics
- Determine recommendedTracks based on the project nature (UX, AI, Web3)
- Use the strategy agent's projectOpportunities
- Use the strategy agent's suggestedPhases
- Use the tech agent's complexityLevel and estimatedEffortNotes
- Use the strategy agent's openQuestions and suggestedNextSteps
- Write comprehensive internalNotes synthesizing all insights
- Write researchInsights based on the research agent's output

Provide your synthesis as valid JSON only.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const responseContent = completion.choices[0]?.message?.content;

  if (!responseContent) {
    throw new Error("No response from OpenAI Synthesizer Agent");
  }

  const result: GenerateSummaryResponse = JSON.parse(responseContent);

  // Validate structure
  if (!result.clientSummary || !result.internalNotes) {
    throw new Error("Invalid GenerateSummaryResponse structure from OpenAI");
  }

  return result;
}
