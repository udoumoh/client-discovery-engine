import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { DiscoveryAnswers, GenerateSummaryResponse } from "@/lib/types";
import { fetchExaContext } from "@/lib/exa";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const answers: DiscoveryAnswers = body;

    // Validate input
    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid request: answers object required" },
        { status: 400 }
      );
    }

    // Check for required fields
    const requiredFields: (keyof DiscoveryAnswers)[] = [
      "companyName",
      "contactRole",
      "projectName",
      "currentSituation",
      "problemOrOpportunity",
      "targetUsers",
      "existingSolutions",
      "constraints",
      "desiredOutcomes",
      "mustHaveFeatures",
      "niceToHaveFeatures",
    ];

    for (const field of requiredFields) {
      if (!answers[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Fetch external context from Exa AI in parallel
    const [companyInsights, problemInsights, marketInsights] = await Promise.all([
      fetchExaContext(answers.companyName),
      fetchExaContext(answers.problemOrOpportunity),
      fetchExaContext(`${answers.projectName} ${answers.targetUsers}`),
    ]);

    // Log what we got from Exa for debugging
    console.log('Exa Results Summary:');
    console.log(`- Company Insights: ${companyInsights.length} results`);
    console.log(`- Problem Insights: ${problemInsights.length} results`);
    console.log(`- Market Insights: ${marketInsights.length} results`);

    // Build external context object
    const externalContext = {
      companyInsights,
      problemInsights,
      marketInsights,
    };

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create system prompt
    const systemPrompt = `You are a senior digital consultant at Lunim, a digital product agency specializing in three core areas:
1. Human-centric UX and UI design
2. AI implementations and intelligent automation
3. Web3 and decentralized solutions

Your role is to analyze raw discovery questionnaires and produce thorough, strategic project discovery summaries for internal use. You combine business acumen with technical expertise to identify opportunities, risks, and actionable next steps.

You must respond with valid JSON only, matching this EXACT structure:

{
  "clientSummary": {
    "projectOverview": "string - concise 2-3 sentence overview of the project",
    "goals": ["array of 3-5 key strategic project goals"],
    "primaryUserPersona": {
      "name": "string - realistic persona name (e.g., 'Sarah, Product Manager')",
      "description": "string - 2-3 sentences describing the persona's role and context",
      "needs": ["array of 3-5 specific user needs"],
      "frustrations": ["array of 3-5 specific user frustrations or pain points"]
    },
    "recommendedFeatures": {
      "mustHaves": ["array of essential features for MVP/launch"],
      "niceToHaves": ["array of valuable but non-critical features"]
    },
    "constraintsAndRisks": {
      "constraints": ["array of identified constraints (budget, timeline, technical, etc.)"],
      "risks": ["array of potential risks to project success"],
      "assumptions": ["array of key assumptions being made"]
    },
    "successMetrics": ["array of 3-5 measurable, specific success metrics"],
    "recommendedTracks": ["array containing one or more of: UX, AI, Web3"],
    "projectOpportunities": ["array of 3-5 specific opportunities or strategic angles Lunim could explore with this client"],
    "suggestedPhases": [
      {
        "name": "string - phase name (e.g., 'Discovery & Research')",
        "description": "string - what happens in this phase"
      }
    ],
    "complexityLevel": "Low | Medium | High - overall project complexity assessment",
    "estimatedEffortNotes": "string - 2-3 sentences about expected effort, team size, timeline considerations, and complexity drivers",
    "openQuestions": ["array of 3-5 important questions that need clarification with the client before proceeding"],
    "suggestedNextSteps": ["array of 3-5 concrete, actionable steps for the Lunim team to take after this discovery"]
  },
  "internalNotes": "string - detailed internal notes for the Lunim team including strategic recommendations, upsell opportunities, technical considerations, team composition suggestions, and any red flags or concerns. Be direct and candid.",
  "researchInsights": "string - summary of key insights discovered from external research and how they informed your analysis. Mention specific findings that validated, contradicted, or expanded on the client's input."
}

Be insightful, strategic, and actionable. Think like a senior consultant who understands both business and technology.`;

    // Create user prompt with external context
    const userPrompt = `Analyze the following project discovery questionnaire and generate a comprehensive, strategic discovery summary.

Discovery Questionnaire Responses:
${JSON.stringify(answers, null, 2)}

---
EXTERNAL RESEARCH CONTEXT (CRITICAL - MUST USE):
---

**Company Insights:**
${companyInsights.length > 0
  ? companyInsights.map(r => `- ${r.title}\n  ${r.snippet}\n  Source: ${r.url}`).join('\n\n')
  : 'No additional company information found.'}

**Problem/Opportunity Insights:**
${problemInsights.length > 0
  ? problemInsights.map(r => `- ${r.title}\n  ${r.snippet}\n  Source: ${r.url}`).join('\n\n')
  : 'No additional problem/opportunity information found.'}

**Market/User Insights:**
${marketInsights.length > 0
  ? marketInsights.map(r => `- ${r.title}\n  ${r.snippet}\n  Source: ${r.url}`).join('\n\n')
  : 'No additional market/user information found.'}

IMPORTANT: You MUST actively integrate the above external research into your analysis. Specifically:
- Use company insights to validate their description and identify additional context about their business
- Use problem/opportunity insights to identify industry trends, competitive landscape, and similar solutions
- Use market/user insights to inform your user persona, validate target audience assumptions, and identify market opportunities
- Reference specific insights when making recommendations or identifying risks
- If the research contradicts or expands on what the client said, note this in your analysis

Please provide your analysis as a JSON object matching the EXACT structure specified in the system prompt. Populate ALL fields thoughtfully:

**Guidelines:**

1. **projectOverview**: Synthesize the core problem and opportunity into 2-3 clear sentences
2. **goals**: Extract or infer 3-5 strategic business goals
3. **primaryUserPersona**: Create one realistic, detailed persona based on the target users described
4. **recommendedFeatures**: Distinguish between must-haves (MVP) and nice-to-haves based on constraints and desired outcomes
5. **constraintsAndRisks**: Identify explicit constraints from the answers, plus risks you foresee, and key assumptions
6. **successMetrics**: Define 3-5 specific, measurable metrics (e.g., "30% reduction in task completion time")
7. **recommendedTracks**: Select from ["UX", "AI", "Web3"] based on:
   - UX: User experience design, interface design, usability, research
   - AI: Machine learning, NLP, intelligent automation, AI features
   - Web3: Blockchain, crypto, NFTs, decentralized apps, smart contracts
8. **projectOpportunities**: Identify 3-5 specific strategic angles or upsell opportunities for Lunim
9. **suggestedPhases**: Break the project into 3-5 logical phases (e.g., Discovery, Design, Development, Launch)
10. **complexityLevel**: Assess as "Low", "Medium", or "High" based on scope, constraints, and technical requirements
11. **estimatedEffortNotes**: Provide a 2-3 sentence narrative about effort, team composition, timeline
12. **openQuestions**: List 3-5 critical questions Lunim should ask the client before proceeding
13. **suggestedNextSteps**: Provide 3-5 concrete action items for the Lunim team (e.g., "Schedule technical scoping call", "Prepare UX research plan")
14. **internalNotes**: Write detailed, candid internal notes covering strategy, upsell opportunities, technical considerations, team recommendations, and any concerns
15. **researchInsights**: Summarize the key insights from external research and explain how they informed your analysis. Highlight findings that validated, contradicted, or expanded on the client's responses.

Be insightful, strategic, and thorough. Think like a senior consultant conducting a discovery for a high-value client.

Ensure the response is valid JSON only, with no additional text or markdown formatting.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Extract and parse response
    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    const result: GenerateSummaryResponse = JSON.parse(responseContent);

    // Validate structure
    if (!result.clientSummary || !result.internalNotes) {
      throw new Error("Invalid response structure from OpenAI");
    }

    // Return successful response with external context for debugging
    return NextResponse.json({
      ...result,
      externalContext,
    });
  } catch (error) {
    console.error("Error generating summary:", error);

    // Return error response
    return NextResponse.json(
      {
        error: "Failed to generate summary",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
