import {
  useState,
  type FormEvent
} from "react";

import {
  Sparkles
} from "lucide-react";

import {
  LoadingSpinner
} from "@/components/shared/LoadingSpinner";

export type RoadmapInput = {

  role: string;

  weak_topics: string;

  timeline: string;
};

export function RoadmapForm({
  onSubmit,
  loading,
}: {
  onSubmit: (
    data: RoadmapInput
  ) => void;

  loading?: boolean;
}) {

  const [role, setRole] =
    useState("");

  const [weakTopics, setWeakTopics] =
    useState("");

  const [timeline, setTimeline] =
    useState("");

  const submit = (
    e: FormEvent
  ) => {

    e.preventDefault();

    if (!role.trim()) return;

    onSubmit({
      role,

      weak_topics:
        weakTopics,

      timeline,
    });
  };

  return (

    <form
      onSubmit={submit}

      className="glass border border-border rounded-2xl p-6 space-y-4"
    >

      {/* ROLE */}

      <Field label="Target Role">

        <input
          value={role}

          onChange={(e) =>
            setRole(
              e.target.value
            )
          }

          placeholder="e.g. Frontend Developer"

          className="input-style"

          required
        />

      </Field>

      {/* WEAK TOPICS */}

      <Field label="Weak Topics">

        <input
          value={weakTopics}

          onChange={(e) =>
            setWeakTopics(
              e.target.value
            )
          }

          placeholder="e.g. DBMS, Operating Systems"

          className="input-style"
        />

      </Field>

      {/* TIMELINE */}

      <Field label="Timeline">

        <input
          value={timeline}

          onChange={(e) =>
            setTimeline(
              e.target.value
            )
          }

          placeholder="e.g. 3 months"

          className="input-style"

          required
        />

      </Field>

      {/* BUTTON */}

      <button
        type="submit"

        disabled={loading}

        className="w-full gradient-primary text-primary-foreground font-medium rounded-xl py-3 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60"
      >

        {loading ? (

          <LoadingSpinner
            size="sm"
            label="Generating roadmap..."
          />

        ) : (

          <>

            <Sparkles className="size-4" />

            Generate Roadmap

          </>

        )}

      </button>

      <style>{`

        .input-style{
          width:100%;
          background:var(--input);
          border:1px solid var(--border);
          border-radius:12px;
          padding:10px 14px;
          color:var(--foreground);
          font-size:14px;
          outline:none;
          transition:border-color .15s
        }

        .input-style:focus{
          border-color:var(--primary)
        }

      `}</style>

    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {

  return (

    <label className="block">

      <span className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5 block">

        {label}

      </span>

      {children}

    </label>
  );
}