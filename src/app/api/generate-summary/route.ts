import { NextRequest, NextResponse } from "next/server";
import { DiscoveryAnswers, GenerateSummaryResponse } from "@/lib/types";
import { fetchExaContext } from "@/lib/exa";
import {
  runResearchAgent,
  runStrategyAgent,
  runUXAgent,
  runTechAgent,
  runSynthesizerAgent,
  MultiAgentContext,
} from "@/lib/agents";

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

    // ========================================================================
    // Step 1: Fetch external context from Exa AI in parallel
    // ========================================================================
    console.log("Fetching external context from Exa...");
    const [companyInsights, problemInsights, marketInsights] =
      await Promise.all([
        fetchExaContext(answers.companyName),
        fetchExaContext(answers.problemOrOpportunity),
        fetchExaContext(`${answers.projectName} ${answers.targetUsers}`),
      ]);

    // Log what we got from Exa for debugging
    console.log("Exa Results Summary:");
    console.log(`- Company Insights: ${companyInsights.length} results`);
    console.log(`- Problem Insights: ${problemInsights.length} results`);
    console.log(`- Market Insights: ${marketInsights.length} results`);

    // Build external context object
    const externalContext = {
      companyInsights,
      problemInsights,
      marketInsights,
    };

    // ========================================================================
    // Step 2: Run Research Agent
    // ========================================================================
    console.log("Running Research Agent...");
    const researchOutput = await runResearchAgent(answers, externalContext);
    console.log("Research Agent completed");

    // ========================================================================
    // Step 3: Run Strategy Agent
    // ========================================================================
    console.log("Running Strategy Agent...");
    const strategyOutput = await runStrategyAgent(answers, researchOutput);
    console.log("Strategy Agent completed");

    // ========================================================================
    // Step 4: Run UX Agent
    // ========================================================================
    console.log("Running UX Agent...");
    const uxOutput = await runUXAgent(answers, researchOutput, strategyOutput);
    console.log("UX Agent completed");

    // ========================================================================
    // Step 5: Run Tech Agent
    // ========================================================================
    console.log("Running Tech Agent...");
    const techOutput = await runTechAgent(
      answers,
      researchOutput,
      strategyOutput
    );
    console.log("Tech Agent completed");

    // ========================================================================
    // Step 6: Run Synthesizer Agent
    // ========================================================================
    console.log("Running Synthesizer Agent...");
    const context: MultiAgentContext = {
      answers,
      research: researchOutput,
      strategy: strategyOutput,
      ux: uxOutput,
      tech: techOutput,
    };

    const finalSummary: GenerateSummaryResponse =
      await runSynthesizerAgent(context);
    console.log("Synthesizer Agent completed");

    // ========================================================================
    // Step 7: Return final result with external context for debugging
    // ========================================================================
    return NextResponse.json({
      ...finalSummary,
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
