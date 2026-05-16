import {
  useEffect,
  useState
} from "react";

import {
  createFileRoute
} from "@tanstack/react-router";

import {
  toast
} from "sonner";

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

import {
  api
} from "@/lib/api";

export const Route =
  createFileRoute("/roadmap")({

    component: () => (

      <AppLayout>
        <RoadmapPage />
      </AppLayout>

    ),
  });

function RoadmapPage() {

  const [steps, setSteps] =
    useState<RoadmapStep[]>([]);

  const [roadmapId, setRoadmapId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(false);

  // ---------------- LOAD SAVED ROADMAP ---------------- //

  useEffect(() => {

    api.getRoadmaps()

      .then((data) => {

        if (
          !Array.isArray(data) ||
          data.length === 0
        ) {
          return;
        }

        const latest =
          data[0];

        if (
          !latest ||
          !latest.steps
        ) {
          return;
        }

        setRoadmapId(
          latest.id
        );

        setSteps(
          latest.steps
        );

      })

      .catch(console.error);

  }, []);

  // ---------------- GENERATE ROADMAP ---------------- //

  const handleGenerate =
    async (
      data: RoadmapInput
    ) => {

      setLoading(true);

      try {

        const payload = {

          role:
            data.role,

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

        if (
          !res ||
          !res.steps
        ) {

          toast.error(
            "Invalid roadmap response"
          );

          return;
        }

        setRoadmapId(
          res.roadmap_id
        );

        setSteps(
          res.steps
        );

        toast.success(
          `Generated ${res.steps.length} roadmap steps`
        );

      } catch (err: any) {

        toast.error(

          err?.message ||

          "Failed to generate roadmap"
        );

      } finally {

        setLoading(false);
      }
    };

  // ---------------- TOGGLE STEP ---------------- //

  const toggle = async (
    i: number
  ) => {

    const updated =
      steps.map(
        (s, idx) =>

          idx === i

            ? {
                ...s,
                done: !s.done,
              }

            : s
      );

    setSteps(updated);

    try {

      if (roadmapId) {

        await api.updateRoadmapProgress(
          roadmapId,
          updated
        );
      }

    } catch (err) {

      console.error(err);
    }
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

        {/* LEFT PANEL */}

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

        {/* RIGHT PANEL */}

        <div className="lg:col-span-2 space-y-3">

          {/* LOADING */}

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

          {/* EMPTY STATE */}

          {!loading &&
            steps.length === 0 && (

              <EmptyState

                icon={MapIcon}

                title="No roadmap yet"

                description="Fill the form and generate your personalized AI roadmap."
              />

            )}

          {/* ROADMAP STEPS */}

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