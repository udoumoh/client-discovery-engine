"use client";

import React, { useState, useEffect } from "react";
import DiscoveryForm from "@/components/discovery-form";
import ResultView from "@/components/result-view";
import { DiscoveryAnswers, GenerateSummaryResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const PROCESSING_STEPS = [
  "Collecting signals...",
  "Researching company context...",
  "Analyzing market landscape...",
  "Identifying opportunities...",
  "Evaluating risks...",
  "Synthesizing insights...",
  "Finalizing recommendations...",
];

export default function Home() {
  const [answers, setAnswers] = useState<DiscoveryAnswers | null>(null);
  const [result, setResult] = useState<GenerateSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Cycle through processing steps while loading
  useEffect(() => {
    if (!isLoading) {
      setProcessingStep(0);
      return;
    }

    const interval = setInterval(() => {
      setProcessingStep((prev) => (prev + 1) % PROCESSING_STEPS.length);
    }, 2000); // Change step every 2 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (formValues: DiscoveryAnswers) => {
    setAnswers(formValues);
    setIsLoading(true);
    setResult(null);
    setProcessingStep(0);

    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data: GenerateSummaryResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f5f7,_#e5e7eb)] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-12 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              Lunim Discovery Assistant
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              AI-powered project discovery combining structured intake with intelligent web research.
            </p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 rounded-full border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-medium hover:bg-indigo-100"
          >
            Internal tool • AI-assisted discovery
          </Badge>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
          <div className="w-full">
            <DiscoveryForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="w-full">
            <ResultView
              result={result}
              isLoading={isLoading}
              processingStep={PROCESSING_STEPS[processingStep]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
