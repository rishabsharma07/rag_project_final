import {
  useState
} from "react";

import {
  createFileRoute
} from "@tanstack/react-router";

import {
  toast
} from "sonner";

import {
  FileText,
  Sparkles,
  Upload
} from "lucide-react";

import {
  AppLayout
} from "@/components/shared/AppLayout";

import {
  PageHeader
} from "@/components/shared/PageHeader";

import {
  api
} from "@/lib/api";
import ReactMarkdown from "react-markdown"; 
export const Route =
  createFileRoute(
    "/resume_analyzer"
  )({

    component: () => (

      <AppLayout>
        <ResumeAnalyzerPage />
      </AppLayout>

    ),
  });

function ResumeAnalyzerPage() {

  const [file, setFile] =
    useState<File | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [analysis, setAnalysis] =
    useState("");

  // ---------------- ANALYZE ---------------- //

  const handleAnalyze =
    async () => {

      if (!file) {

        toast.error(
          "Please select a resume PDF"
        );

        return;
      }

      setLoading(true);

      try {

        const res =
          await api.analyzeResume(
            file
          );

        setAnalysis(
          res.analysis
        );

        toast.success(
          "Resume analyzed successfully"
        );

      } catch (err: any) {

        toast.error(

          err?.message ||

          "Resume analysis failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <>

      <PageHeader

        title="Resume Analyzer"

        description="Upload your resume and get AI-powered feedback, ATS suggestions, and improvement tips."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL */}

        <div className="lg:col-span-1">

          <div className="glass border border-border rounded-2xl p-6 space-y-5">

            {/* ICON */}

            <div className="flex items-center gap-2">

              <Sparkles className="size-5 text-primary" />

              <h2 className="font-semibold">

                AI Resume Review

              </h2>

            </div>

            {/* FILE INPUT */}

            <label className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors">

              <Upload className="size-10 mb-3 text-muted-foreground" />

              <span className="font-medium">

                Upload Resume PDF

              </span>

              <span className="text-sm text-muted-foreground mt-1">

                PDF files only

              </span>

              <input

                type="file"

                accept=".pdf"

                className="hidden"

                onChange={(e) => {

                  const selected =
                    e.target.files?.[0];

                  if (selected) {

                    setFile(
                      selected
                    );
                  }
                }}
              />

            </label>

            {/* FILE NAME */}

            {file && (

              <div className="text-sm text-muted-foreground break-all">

                Selected:
                {" "}
                {file.name}

              </div>

            )}

            {/* BUTTON */}

            <button

              onClick={
                handleAnalyze
              }

              disabled={
                loading
              }

              className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-medium hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60"
            >

              {loading
                ? "Analyzing Resume..."
                : "Analyze Resume"}

            </button>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="lg:col-span-2">

          {!analysis ? (

            <div className="glass border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]">

              <FileText className="size-16 text-muted-foreground mb-4" />

              <h3 className="text-xl font-semibold mb-2">

                No Resume Analysis Yet

              </h3>

              <p className="text-muted-foreground max-w-md">

                Upload your resume PDF and receive AI-powered feedback including strengths, weaknesses, ATS tips, and improvement suggestions.

              </p>

            </div>

          ) : (

            <div className="glass border border-border rounded-2xl p-6 whitespace-pre-wrap leading-7">

              <div className="flex items-center gap-2 mb-5">

                <Sparkles className="size-5 text-primary" />

                <h2 className="text-xl font-semibold">

                  AI Resume Feedback

                </h2>

              </div>

              <div className="space-y-6">

  {analysis
    .split("##")
    .filter(Boolean)
    .map((section, index) => {

      const lines =
        section.trim().split("\n");

      const title =
        lines[0];

      const content =
        lines.slice(1).join("\n");

      return (

        <div

          key={index}

          className="glass border border-border rounded-2xl p-6"
        >

          <h2 className="text-xl font-semibold mb-4 text-primary">

            {title}

          </h2>

          <div className="prose prose-invert max-w-none text-sm leading-7">

            <ReactMarkdown>

              {content}

            </ReactMarkdown>

          </div>

        </div>
      );
    })}
</div>

            </div>

          )}

        </div>

      </div>

    </>
  );
}