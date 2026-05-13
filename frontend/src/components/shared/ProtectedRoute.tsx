import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { LoadingSpinner } from "./LoadingSpinner";

/**
 * ProtectedRoute — checks for a JWT token in localStorage on mount
 * and redirects to /login when missing. Client-side only.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      navigate({ to: "/login" });
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  return <>{children}</>;
}
