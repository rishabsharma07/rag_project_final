import { useState } from "react";

import { createFileRoute }
from "@tanstack/react-router";

import { toast }
from "sonner";

import {
  Map as MapIcon
} from "lucide-react";

import {
  AppLayout
} from "@/components/shared/AppLayout";

import {
  PageHeader
} from "@/components/shared/PageHeader";

import {
  RoadmapForm,
  type RoadmapInput
} from "@/components/roadmap/RoadmapForm";

import {
  RoadmapCard,
  type RoadmapStep
} from "@/components/roadmap/RoadmapCard";

import {
  ProgressCard
} from "@/components/roadmap/ProgressCard";

import {
  EmptyState
} from "@/components/shared/EmptyState";

import { api }
from "@/lib/api";

export const Route =
  createFileRoute("/roadmap")({

    component: () => (

      <AppLayout>
        <RoadmapPage />
      </AppLayout>

    ),
  });

function normalizeRoadmap(
  raw: any
): RoadmapStep[] {

  if (!raw) return [];

  if (Array.isArray(raw)) {

    return raw.map(
      normalizeStep
    );
  }

  if (
    Array.isArray(raw.roadmap)
  ) {

    return raw.roadmap.map(
      normalizeStep
    );
  }

  if (
    Array.isArray(raw.steps)
  ) {

    return raw.steps.map(
      normalizeStep
    );
  }

  if (
    typeof raw === "string"
  ) {

    return raw
      .split(/\n+/)
      .map((s) =>
        s.trim()
      )
      .filter(Boolean)
      .map((title) => ({
        title,
        done: false,
      }));
  }

  if (
    typeof raw.roadmap ===
    "string"
  ) {

    return normalizeRoadmap(
      raw.roadmap
    );
  }

  return [];
}

function normalizeStep(
  s: any
): RoadmapStep {

  if (
    typeof s === "string"
  ) {

    return {
      title: s,
      done: false,
    };
  }

  return {

    title:
      s.title ||
      s.name ||
      s.step ||
      "Untitled step",

    description:
      s.description ||
      s.details ||
      s.summary,

    done: false,
  };
}

function RoadmapPage() {

  const [steps, setSteps] =
    useState<RoadmapStep[]>(
      []
    );

  const [loading, setLoading] =
    useState(false);

  const handleGenerate =
    async (
      data: RoadmapInput
    ) => {

      setLoading(true);

      try {

        const payload = {

          role: data.role,

          weak_topics:
            data.weak_topics
              .split(",")
              .map((t) =>
                t.trim()
              )
              .filter(Boolean),

          timeline:
            data.timeline,
        };

        const res =
          await api.generateRoadmap(
            payload
          );

        const normalized =
          normalizeRoadmap(
            res.roadmap
          );

        if (
          normalized.length === 0
        ) {

          toast.error(
            "Empty roadmap response from AI"
          );

        } else {

          setSteps(
            normalized
          );

          toast.success(
            `Generated ${normalized.length} roadmap steps`
          );
        }

      } catch (err: any) {

        toast.error(
          err?.message ||
          "Failed to generate roadmap"
        );

      } finally {

        setLoading(false);
      }
    };

  const toggle = (
    i: number
  ) => {

    setSteps((prev) =>
      prev.map(
        (s, idx) =>

          idx === i
            ? {
                ...s,
                done: !s.done,
              }
            : s
      )
    );
  };

  const done =
    steps.filter(
      (s) => s.done
    ).length;

  return (
    <>

      <PageHeader
        title="AI Roadmap"

        description="Generate a personalized AI learning roadmap based on your goals and weak topics."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-1 space-y-4">

          <RoadmapForm
            onSubmit={
              handleGenerate
            }

            loading={loading}
          />

          {steps.length > 0 && (

            <ProgressCard
              done={done}
              total={steps.length}
            />

          )}

        </div>

        <div className="lg:col-span-2 space-y-3">

          {loading && (

            <>
              {[0, 1, 2].map(
                (i) => (

                  <div
                    key={i}
                    className="h-24 rounded-2xl shimmer"
                  />

                )
              )}
            </>

          )}

          {!loading &&
            steps.length === 0 && (

              <EmptyState
                icon={MapIcon}

                title="No roadmap yet"

                description="Fill the form and generate your personalized AI roadmap."
              />

            )}

          {!loading &&
            steps.map(
              (s, i) => (

                <RoadmapCard
                  key={i}

                  step={s}

                  index={i}

                  onToggle={() =>
                    toggle(i)
                  }
                />

              )
            )}

        </div>

      </div>

    </>
  );
}