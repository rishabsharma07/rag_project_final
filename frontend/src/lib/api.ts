import { authFetch } from "./authFetch";

import type { User } from "./auth";

async function handle<T>(
  res: Response
): Promise<T> {

  const contentType =
    res.headers.get(
      "content-type"
    ) || "";

  const isJson =
    contentType.includes(
      "application/json"
    );

  const data = isJson
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {

    const msg =

      (isJson &&
        data &&
        (
          data.detail ||
          data.message
        )) ||

      (
        typeof data ===
          "string" &&
        data
      ) ||

      `Request failed (${res.status})`;

    throw new Error(

      typeof msg ===
        "string"

        ? msg

        : "Request failed"
    );
  }

  return data as T;
}

export type LoginResponse = {

  access_token: string;

  user: User;
};

export const api = {

  // ---------------- SIGNUP ---------------- //

  signupUser(payload: {

    name: string;

    email: string;

    password: string;
  }) {

    return authFetch(

      "/signup",

      {
        method: "POST",

        body: JSON.stringify(
          payload
        ),

        auth: false,
      }

    ).then(

      handle<{
        message?: string;
      }>
    );
  },

  // ---------------- LOGIN ---------------- //

  loginUser(payload: {

    email: string;

    password: string;
  }) {

    return authFetch(

      "/login",

      {
        method: "POST",

        body: JSON.stringify(
          payload
        ),

        auth: false,
      }

    ).then(
      handle<LoginResponse>
    );
  },

  // ---------------- ROADMAP ---------------- //

  generateRoadmap(payload: {

    role: string;

    weak_topics: string[];

    timeline: string;
  }) {

    return authFetch(

      "/roadmap",

      {
        method: "POST",

        body: JSON.stringify(
          payload
        ),
      }

    ).then(

      handle<{
        roadmap: string;
      }>
    );
  },

  // ---------------- QUIZ ---------------- //

  generateQuiz(payload: {

    topic: string;

    difficulty: string;
  }) {

    return authFetch(

      "/quiz",

      {
        method: "POST",

        body: JSON.stringify(
          payload
        ),
      }

    ).then(

      handle<{

        questions: {

          question: string;

          options: string[];

          correct_answer: string;

          explanation: string;

        }[];
      }>
    );
  },

  // ---------------- UPLOAD PDF ---------------- //

  uploadPDF(

    file: File,

    onProgress?: (
      pct: number
    ) => void
  ) {

    return new Promise<any>(

      (
        resolve,
        reject
      ) => {

        const xhr =
          new XMLHttpRequest();

        const base =

          (
            typeof import.meta !==
              "undefined" &&

            (import.meta as any)
              .env?.VITE_API_URL
          ) ||

          "http://127.0.0.1:8000";

        xhr.open(

          "POST",

          `${base}/upload`
        );

        const token =

          typeof window !==
          "undefined"

            ? localStorage.getItem(
                "token"
              )

            : null;

        if (token) {

          xhr.setRequestHeader(

            "Authorization",

            `Bearer ${token}`
          );
        }

        xhr.upload.onprogress =
          (evt) => {

            if (

              evt.lengthComputable &&

              onProgress
            ) {

              onProgress(

                Math.round(

                  (
                    evt.loaded /
                    evt.total
                  ) * 100
                )
              );
            }
          };

        xhr.onload = () => {

          try {

            const data =

              xhr.responseText

                ? JSON.parse(
                    xhr.responseText
                  )

                : {};

            if (

              xhr.status >= 200 &&

              xhr.status < 300
            ) {

              resolve(data);

            } else {

              reject(

                new Error(

                  data?.detail ||

                  `Upload failed (${xhr.status})`
                )
              );
            }

          } catch {

            reject(

              new Error(
                "Upload failed"
              )
            );
          }
        };

        xhr.onerror = () =>

          reject(

            new Error(
              "Network error during upload"
            )
          );

        const fd =
          new FormData();

        fd.append(
          "file",
          file
        );

        xhr.send(fd);
      }
    );
  },

  // ---------------- CHAT ---------------- //

  sendChatMessage(
    message: string
  ) {

    return authFetch(

      "/chat",

      {
        method: "POST",

        body: JSON.stringify({
          query: message,
        }),
      }

    ).then(

      handle<{
        response: string;
      }>
    );
  },

  // ---------------- GET DOCUMENTS ---------------- //

  getDocuments() {

    return authFetch(

      "/documents"

    ).then(

      handle<
        {
          id: number;

          filename: string;
        }[]
      >
    );
  },

  // ---------------- DELETE DOCUMENT ---------------- //

deleteDocument(
  id: number
) {

  return authFetch(

    `/documents/${id}`,

    {
      method: "DELETE",
    }

  ).then(
    handle<any>
  );
},
// ---------------- CHAT HISTORY ---------------- //

getChatHistory() {

  return authFetch(
    "/chat-history"
  ).then(
    handle<{
      messages: {
        role: string;
        content: string;
      }[];
    }>
  );
},

  // ---------------- DASHBOARD ---------------- //

  getDashboardStats() {

    return authFetch(

      "/dashboard"

    ).then(
      handle<any>
    );
  },
};