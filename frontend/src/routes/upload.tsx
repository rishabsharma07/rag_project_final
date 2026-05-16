import { useState, useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { toast } from "sonner";

import { AppLayout } from "@/components/shared/AppLayout";

import { PageHeader } from "@/components/shared/PageHeader";

import { UploadBox } from "@/components/upload/UploadBox";

import {
  UploadedFiles,
  type UploadedFile
} from "@/components/upload/UploadedFiles";

import { UploadProgress } from "@/components/upload/UploadProgress";

import { api } from "@/lib/api";

export const Route = createFileRoute("/upload")({

  component: () => (

    <AppLayout>
      <UploadPage />
    </AppLayout>

  ),
});

function UploadPage() {

  const [files, setFiles] =
    useState<UploadedFile[]>([]);

  const [progress, setProgress] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ---------------- LOAD DOCUMENTS ---------------- //

  useEffect(() => {

    api.getDocuments()

      .then((docs) => {

        const mapped =
          docs.map((doc: any) => ({

            id: doc.id,

            name: doc.filename,

          }));

        setFiles(mapped);

      })

      .catch((err) => {

        console.error(err);

        toast.error(
          "Failed to load documents"
        );

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);

  // ---------------- UPLOAD PDF ---------------- //

  const handleUpload =
    async (file: File) => {

      setProgress(0);

      try {

        const res =
          await api.uploadPDF(
            file,
            setProgress
          );

        const uploadedFile = {

          id:
            res?.document_id ??
            Date.now(),

          name:
            res?.filename ??
            file.name,

        };

        setFiles((prev) => [
          uploadedFile,
          ...prev
        ]);

        toast.success(
          "Uploaded successfully"
        );

      } catch (err: any) {

        toast.error(
          err?.message ||
          "Upload failed"
        );

      } finally {

        setProgress(null);

      }
    };

  // ---------------- DELETE ---------------- //

const handleDelete =
  async (
    id: string | number
  ) => {

    try {

      await api.deleteDocument(
        Number(id)
      );

      setFiles((prev) =>
        prev.filter(
          (f) => f.id !== id
        )
      );

      toast.success(
        "File deleted"
      );

    } catch (err: any) {

      toast.error(
        err?.message ||
        "Delete failed"
      );
    }
  };

  return (
    <>

      <PageHeader
        title="Upload PDFs"

        description="Add documents to your knowledge base — your AI mentor will use them to answer questions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT SIDE */}

        <div className="space-y-4">

          <UploadBox
            onFile={handleUpload}

            disabled={
              progress !== null
            }
          />

          {progress !== null && (

            <UploadProgress
              value={progress}
            />

          )}

        </div>

        {/* RIGHT SIDE */}

        <div>

          <h3 className="font-medium mb-3">

            Your files

          </h3>

          {loading ? (

            <div className="space-y-2">

              <div className="h-16 rounded-xl shimmer" />

              <div className="h-16 rounded-xl shimmer" />

            </div>

          ) : (

            <UploadedFiles
              files={files}

              onDelete={handleDelete}
            />

          )}

        </div>

      </div>

    </>
  );
}