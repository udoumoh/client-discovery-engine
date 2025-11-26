"use client";

import React, { useState } from "react";
import { DiscoveryAnswers } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DiscoveryFormProps {
  onSubmit: (values: DiscoveryAnswers) => void;
  isLoading: boolean;
}

export default function DiscoveryForm({ onSubmit, isLoading }: DiscoveryFormProps) {
  const [formValues, setFormValues] = useState<DiscoveryAnswers>({
    companyName: "",
    contactRole: "",
    projectName: "",
    currentSituation: "",
    problemOrOpportunity: "",
    targetUsers: "",
    existingSolutions: "",
    constraints: "",
    desiredOutcomes: "",
    mustHaveFeatures: "",
    niceToHaveFeatures: "",
  });

  const updateField = (key: keyof DiscoveryAnswers, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Card className="rounded-3xl bg-white/90 border border-slate-200 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur">
      <CardHeader className="space-y-1.5 p-6">
        <CardTitle className="text-xl font-semibold text-slate-900">
          Client discovery intake
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 leading-relaxed">
          Capture the essentials of a new engagement in a few structured questions.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-slate-800">
                Company Name
              </Label>
              <Input
                id="companyName"
                value={formValues.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                required
                className="h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80"
                placeholder="Acme Inc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactRole" className="text-sm font-medium text-slate-800">
                Your Role
              </Label>
              <Input
                id="contactRole"
                value={formValues.contactRole}
                onChange={(e) => updateField("contactRole", e.target.value)}
                required
                className="h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80"
                placeholder="Product Manager"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium text-slate-800">
              Project Name
            </Label>
            <Input
              id="projectName"
              value={formValues.projectName}
              onChange={(e) => updateField("projectName", e.target.value)}
              required
              className="h-10 rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80"
              placeholder="Customer Portal Redesign"
            />
          </div>

          <Separator className="bg-slate-200" />

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="currentSituation" className="text-sm font-medium text-slate-800">
                Current Situation
              </Label>
              <Textarea
                id="currentSituation"
                value={formValues.currentSituation}
                onChange={(e) => updateField("currentSituation", e.target.value)}
                required
                className="min-h-[96px] rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80 resize-none"
                placeholder="Describe the current state of your business or product"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemOrOpportunity" className="text-sm font-medium text-slate-800">
                Problem or Opportunity
              </Label>
              <Textarea
                id="problemOrOpportunity"
                value={formValues.problemOrOpportunity}
                onChange={(e) => updateField("problemOrOpportunity", e.target.value)}
                required
                className="min-h-[96px] rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80 resize-none"
                placeholder="What problem are you solving or opportunity pursuing?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUsers" className="text-sm font-medium text-slate-800">
                Target Users
              </Label>
              <Textarea
                id="targetUsers"
                value={formValues.targetUsers}
                onChange={(e) => updateField("targetUsers", e.target.value)}
                required
                className="min-h-[96px] rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80 resize-none"
                placeholder="Who are the primary users?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="existingSolutions" className="text-sm font-medium text-slate-800">
                Existing Solutions
              </Label>
              <Textarea
                id="existingSolutions"
                value={formValues.existingSolutions}
                onChange={(e) => updateField("existingSolutions", e.target.value)}
                required
                className="min-h-[96px] rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80 resize-none"
                placeholder="What solutions exist? How do users solve this today?"
              />
            </div>
          </div>

          <Separator className="bg-slate-200" />

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="constraints" className="text-sm font-medium text-slate-800">
                Constraints
              </Label>
              <Textarea
                id="constraints"
                value={formValues.constraints}
                onChange={(e) => updateField("constraints", e.target.value)}
                required
                className="min-h-[96px] rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80 resize-none"
                placeholder="Budget, timeline, technical, or other constraints"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desiredOutcomes" className="text-sm font-medium text-slate-800">
                Desired Outcomes
              </Label>
              <Textarea
                id="desiredOutcomes"
                value={formValues.desiredOutcomes}
                onChange={(e) => updateField("desiredOutcomes", e.target.value)}
                required
                className="min-h-[96px] rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80 resize-none"
                placeholder="What does success look like?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mustHaveFeatures" className="text-sm font-medium text-slate-800">
                Must-Have Features
              </Label>
              <Textarea
                id="mustHaveFeatures"
                value={formValues.mustHaveFeatures}
                onChange={(e) => updateField("mustHaveFeatures", e.target.value)}
                required
                className="min-h-[96px] rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80 resize-none"
                placeholder="Essential features for launch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niceToHaveFeatures" className="text-sm font-medium text-slate-800">
                Nice-to-Have Features
              </Label>
              <Textarea
                id="niceToHaveFeatures"
                value={formValues.niceToHaveFeatures}
                onChange={(e) => updateField("niceToHaveFeatures", e.target.value)}
                required
                className="min-h-[96px] rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-2 focus-visible:ring-slate-900/80 focus-visible:border-slate-900/80 resize-none"
                placeholder="Features that would enhance the solution"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 h-10 text-sm font-medium shadow-sm transition disabled:opacity-80 disabled:cursor-wait"
            >
              {isLoading ? "Generating…" : "Generate Summary"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
