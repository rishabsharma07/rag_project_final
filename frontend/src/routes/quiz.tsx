import { useState } from "react";

import { createFileRoute }
from "@tanstack/react-router";

import { toast }
from "sonner";

import {
  Brain,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  AppLayout
} from "@/components/shared/AppLayout";

import {
  PageHeader
} from "@/components/shared/PageHeader";

import { api }
from "@/lib/api";

export const Route =
  createFileRoute("/quiz")({

    component: () => (

      <AppLayout>
        <QuizPage />
      </AppLayout>

    ),
  });

type Question = {

  question: string;

  options: string[];

  correct_answer: string;

  explanation: string;
};

function QuizPage() {

  const [topic, setTopic] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("medium");

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedAnswers,
    setSelectedAnswers] =
      useState<
        Record<number, string>
      >({});

  const [submitted,
    setSubmitted] =
      useState(false);

  // ---------------- GENERATE QUIZ ---------------- //

  const handleGenerate =
    async () => {

      if (!topic.trim()) {

        toast.error(
          "Enter a topic"
        );

        return;
      }

      setLoading(true);

      try {

        const response =
          await api.generateQuiz({
            topic: topic.trim(),
            difficulty,
          });

        console.log(
          "QUIZ RESPONSE:",
          response
        );

        // SAFETY NORMALIZATION

        let questionsData = [];

        if (
          response &&
          Array.isArray(
            response.questions
          )
        ) {

          questionsData =
            response.questions;

        } else if (
          response &&
          response.quiz
        ) {

          questionsData =
            response.quiz;

        }

        if (
          !questionsData ||
          questionsData.length === 0
        ) {

          toast.error(
            "No quiz generated"
          );

          return;
        }

        setQuestions(
          questionsData
        );

        setSelectedAnswers(
          {}
        );

        setSubmitted(false);

        toast.success(
          "Quiz generated successfully"
        );

      } catch (err: any) {

        console.error(err);

        toast.error(
          err?.message ||
          "Failed to generate quiz"
        );

      } finally {

        setLoading(false);
      }
    };

  // ---------------- SELECT ANSWER ---------------- //

  const selectAnswer = (
    qIndex: number,
    option: string
  ) => {

    if (submitted) return;

    setSelectedAnswers(
      (prev) => ({
        ...prev,
        [qIndex]: option,
      })
    );
  };

  // ---------------- SUBMIT QUIZ ---------------- //

  const handleSubmitQuiz =
    () => {

      setSubmitted(true);

      toast.success(
        "Quiz submitted"
      );
    };

  // ---------------- SCORE ---------------- //

  const score =
    questions.filter(
      (q, idx) =>

        selectedAnswers[idx] ===
        q.correct_answer

    ).length;

  return (
    <>

      <PageHeader
        title="AI Quiz"

        description="Generate personalized AI quizzes for interview preparation."
      />

      {/* FORM */}

      <div className="glass border border-border rounded-2xl p-6 space-y-4">

        {/* TOPIC */}

        <div>

          <label className="text-sm text-muted-foreground">

            Topic

          </label>

          <input
            value={topic}

            onChange={(e) =>
              setTopic(
                e.target.value
              )
            }

            placeholder="e.g. DBMS"

            className="w-full mt-1 rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          />

        </div>

        {/* DIFFICULTY */}

        <div>

          <label className="text-sm text-muted-foreground">

            Difficulty

          </label>

          <select
            value={difficulty}

            onChange={(e) =>
              setDifficulty(
                e.target.value
              )
            }

            className="w-full mt-1 rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          >

            <option value="easy">
              Easy
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="hard">
              Hard
            </option>

          </select>

        </div>

        {/* GENERATE BUTTON */}

        <button
          onClick={
            handleGenerate
          }

          disabled={loading}

          className="gradient-primary rounded-xl px-5 py-3 text-primary-foreground font-medium hover:scale-[1.01] transition-transform"
        >

          {loading
            ? "Generating..."
            : "Generate Quiz"}

        </button>

      </div>

      {/* QUESTIONS */}

      <div className="mt-6 space-y-6">

        {questions.map(
          (q, qIndex) => (

            <div
              key={qIndex}

              className="glass border border-border rounded-2xl p-6"
            >

              {/* QUESTION */}

              <div className="flex items-start gap-3">

                <Brain className="size-5 text-primary mt-1" />

                <h2 className="font-medium text-lg">

                  {qIndex + 1}. {q.question}

                </h2>

              </div>

              {/* OPTIONS */}

              <div className="mt-5 space-y-3">

                {q.options?.map(
                  (option, oIndex) => {

                    const selected =
                      selectedAnswers[qIndex] ===
                      option;

                    const correct =
                      q.correct_answer ===
                      option;

                    let style =
                      "border-border";

                    if (submitted) {

                      if (correct) {

                        style =
                          "border-green-500 bg-green-500/10";

                      } else if (
                        selected &&
                        !correct
                      ) {

                        style =
                          "border-red-500 bg-red-500/10";
                      }

                    } else if (
                      selected
                    ) {

                      style =
                        "border-primary bg-primary/10";
                    }

                    return (

                      <button
                        key={oIndex}

                        onClick={() =>
                          selectAnswer(
                            qIndex,
                            option
                          )
                        }

                        className={`w-full text-left rounded-xl border p-4 transition ${style}`}
                      >

                        <div className="flex items-center justify-between gap-3">

                          <span>
                            {option}
                          </span>

                          {submitted &&
                            correct && (

                              <CheckCircle2 className="size-5 text-green-500" />

                            )}

                          {submitted &&
                            selected &&
                            !correct && (

                              <XCircle className="size-5 text-red-500" />

                            )}

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

              {/* EXPLANATION */}

              {submitted && (

                <div className="mt-5 rounded-xl bg-muted/40 p-4">

                  <h3 className="font-medium mb-2">

                    Explanation

                  </h3>

                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">

                    {q.explanation}

                  </p>

                </div>

              )}

            </div>
          )
        )}

      </div>

      {/* SUBMIT QUIZ */}

      {questions.length > 0 &&
        !submitted && (

          <button
            onClick={
              handleSubmitQuiz
            }

            className="mt-6 gradient-primary rounded-xl px-6 py-3 text-primary-foreground font-medium"
          >

            Submit Quiz

          </button>

        )}

      {/* SCORE */}

      {submitted && (

        <div className="mt-6 glass border border-border rounded-2xl p-6">

          <h2 className="text-2xl font-semibold">

            Quiz Result

          </h2>

          <p className="mt-2 text-muted-foreground">

            You scored {score} out of {questions.length}

          </p>

        </div>

      )}

    </>
  );
}