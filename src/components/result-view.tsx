"use client";

import React from "react";
import { GenerateSummaryResponse } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ResultViewProps {
  result: GenerateSummaryResponse | null;
  isLoading: boolean;
  processingStep?: string;
}

export default function ResultView({ result, isLoading, processingStep }: ResultViewProps) {
  const handleCopy = () => {
    if (!result) return;

    const text = formatSummaryAsText(result);
    navigator.clipboard.writeText(text);
    alert("Summary copied to clipboard!");
  };

  const handleDownload = () => {
    if (!result) return;

    const text = formatSummaryAsText(result);
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "discovery-summary.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSummaryAsText = (data: GenerateSummaryResponse): string => {
    const summary = data.clientSummary;
    return `# Project Discovery Summary

## Project Overview
${summary.projectOverview}

## Goals
${summary.goals.map((g) => `- ${g}`).join("\n")}

## Primary User Persona
**${summary.primaryUserPersona.name}**

${summary.primaryUserPersona.description}

### Needs
${summary.primaryUserPersona.needs.map((n) => `- ${n}`).join("\n")}

### Frustrations
${summary.primaryUserPersona.frustrations.map((f) => `- ${f}`).join("\n")}

## Recommended Features

### Must-Haves
${summary.recommendedFeatures.mustHaves.map((f) => `- ${f}`).join("\n")}

### Nice-to-Haves
${summary.recommendedFeatures.niceToHaves.map((f) => `- ${f}`).join("\n")}

## Constraints and Risks

### Constraints
${summary.constraintsAndRisks.constraints.map((c) => `- ${c}`).join("\n")}

### Risks
${summary.constraintsAndRisks.risks.map((r) => `- ${r}`).join("\n")}

### Assumptions
${summary.constraintsAndRisks.assumptions.map((a) => `- ${a}`).join("\n")}

## Success Metrics
${summary.successMetrics.map((m) => `- ${m}`).join("\n")}

## Recommended Tracks
${summary.recommendedTracks.join(", ")}

## Project Opportunities
${summary.projectOpportunities.map((o) => `- ${o}`).join("\n")}

## Suggested Phases
${summary.suggestedPhases.map((p, idx) => `### ${idx + 1}. ${p.name}\n${p.description}`).join("\n\n")}

## Complexity & Effort
**Complexity Level:** ${summary.complexityLevel}

${summary.estimatedEffortNotes}

## Open Questions
${summary.openQuestions.map((q) => `- ${q}`).join("\n")}

## Suggested Next Steps
${summary.suggestedNextSteps.map((s, idx) => `${idx + 1}. ${s}`).join("\n")}

---

## Internal Notes
${data.internalNotes}
`;
  };

  if (isLoading && !result) {
    return (
      <Card className="rounded-3xl bg-white/90 border border-slate-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur flex flex-col h-full">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-semibold text-slate-900">Discovery Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 relative">
              <div className="h-12 w-12 rounded-full border-2 border-slate-200"></div>
              <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
            </div>
            <p className="text-base font-medium text-slate-900">
              Generating discovery summary
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {processingStep || "We're analyzing the brief and external context."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="rounded-3xl bg-white/90 border border-slate-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur flex flex-col h-full">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-semibold text-slate-900">Discovery Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-slate-900">No summary yet</h3>
            <p className="max-w-sm text-sm text-slate-500 leading-relaxed">
              Fill in the discovery form to generate an AI-powered project brief
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summary = result.clientSummary;

  return (
    <Card className="rounded-3xl bg-white/90 border border-slate-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur flex flex-col h-full">
      <CardHeader className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold text-slate-900">Discovery Summary</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="border border-slate-200 bg-white hover:bg-slate-100 rounded-full px-3 h-8 text-xs font-medium text-slate-700 inline-flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="border border-slate-200 bg-white hover:bg-slate-100 rounded-full px-3 h-8 text-xs font-medium text-slate-700 inline-flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 mb-6">
            <TabsTrigger
              value="client"
              className="rounded-full px-3 py-1 text-xs font-medium transition data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-800"
            >
              Client Summary
            </TabsTrigger>
            <TabsTrigger
              value="internal"
              className="rounded-full px-3 py-1 text-xs font-medium transition data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-800"
            >
              Internal Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client">
            <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
              <div className="space-y-6">
                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Project Overview
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700">{summary.projectOverview}</p>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Goals
                  </h3>
                  <ul className="space-y-2">
                    {summary.goals.map((goal, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span className="text-sm text-slate-700">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Primary User Persona
                  </h3>
                  <div className="space-y-4 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                    <h4 className="text-lg font-semibold text-slate-900">
                      {summary.primaryUserPersona.name}
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {summary.primaryUserPersona.description}
                    </p>

                    <div className="grid gap-4 pt-2 sm:grid-cols-2">
                      <div>
                        <h5 className="mb-2 text-xs font-semibold tracking-[0.16em] uppercase text-emerald-700">
                          Needs
                        </h5>
                        <ul className="space-y-1.5">
                          {summary.primaryUserPersona.needs.map((need, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-slate-600">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                              <span>{need}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="mb-2 text-xs font-semibold tracking-[0.16em] uppercase text-rose-700">
                          Frustrations
                        </h5>
                        <ul className="space-y-1.5">
                          {summary.primaryUserPersona.frustrations.map((frustration, idx) => (
                            <li key={idx} className="flex gap-2 text-sm text-slate-600">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-600" />
                              <span>{frustration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Recommended Features
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-emerald-700">Must-Haves</h4>
                      <ul className="space-y-2">
                        {summary.recommendedFeatures.mustHaves.map((feature, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                            <span className="text-sm text-slate-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-blue-700">Nice-to-Haves</h4>
                      <ul className="space-y-2">
                        {summary.recommendedFeatures.niceToHaves.map((feature, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                            <span className="text-sm text-slate-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Constraints & Risks
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-amber-700">Constraints</h4>
                      <ul className="space-y-2">
                        {summary.constraintsAndRisks.constraints.map((constraint, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                            <span className="text-sm text-slate-700">{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-red-700">Risks</h4>
                      <ul className="space-y-2">
                        {summary.constraintsAndRisks.risks.map((risk, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                            <span className="text-sm text-slate-700">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-yellow-700">Assumptions</h4>
                      <ul className="space-y-2">
                        {summary.constraintsAndRisks.assumptions.map((assumption, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-600" />
                            <span className="text-sm text-slate-700">{assumption}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Success Metrics
                  </h3>
                  <ul className="space-y-2">
                    {summary.successMetrics.map((metric, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span className="text-sm text-slate-700">{metric}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Recommended Tracks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {summary.recommendedTracks.map((track) => (
                      <Badge
                        key={track}
                        variant="outline"
                        className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 text-xs font-medium"
                      >
                        {track}
                      </Badge>
                    ))}
                  </div>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Project Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {summary.projectOpportunities.map((opportunity, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        <span className="text-sm text-slate-700">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Suggested Phases
                  </h3>
                  <div className="space-y-3">
                    {summary.suggestedPhases.map((phase, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4"
                      >
                        <h4 className="mb-1 font-semibold text-slate-900">
                          {idx + 1}. {phase.name}
                        </h4>
                        <p className="text-sm text-slate-600">{phase.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Complexity & Effort
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-700">
                        Complexity Level:
                      </span>
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          summary.complexityLevel === "High"
                            ? "border-red-300 bg-red-50 text-red-700"
                            : summary.complexityLevel === "Medium"
                            ? "border-amber-300 bg-amber-50 text-amber-700"
                            : "border-green-300 bg-green-50 text-green-700"
                        }`}
                      >
                        {summary.complexityLevel}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {summary.estimatedEffortNotes}
                    </p>
                  </div>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Open Questions
                  </h3>
                  <ul className="space-y-2">
                    {summary.openQuestions.map((question, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                        <span className="text-sm text-slate-700">{question}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <Separator className="bg-slate-200" />

                <section>
                  <h3 className="mb-3 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                    Suggested Next Steps
                  </h3>
                  <ul className="space-y-2">
                    {summary.suggestedNextSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-slate-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="internal">
            <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                <h3 className="mb-4 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
                  Internal Team Notes
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {result.internalNotes}
                </p>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
