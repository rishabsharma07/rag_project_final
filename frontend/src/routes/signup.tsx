import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { AuthField } from "./login";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.signupUser({ name, email, password });
      // Auto-login after signup for a smooth flow
      try {
        const res = await api.loginUser({ email, password });
        auth.setSession(res.access_token, res.user);
        toast.success(`Welcome, ${res.user.name}!`);
        navigate({ to: "/dashboard" });
      } catch {
        toast.success("Account created. Please log in.");
        navigate({ to: "/login" });
      }
    } catch (err: any) {
      toast.error(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass card-shadow border border-border rounded-3xl p-8"
      >
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="size-10 rounded-xl gradient-primary flex items-center justify-center glow-shadow">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <span className="font-semibold">AI Career Copilot</span>
        </div>
        <h1 className="text-2xl font-semibold text-center">Create your account</h1>
        <p className="text-sm text-muted-foreground text-center mt-1.5">
          Start learning with your personal AI mentor
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <AuthField icon={User} type="text" placeholder="Full name" value={name} onChange={setName} required />
          <AuthField icon={Mail} type="email" placeholder="you@email.com" value={email} onChange={setEmail} required />
          <AuthField icon={Lock} type="password" placeholder="Password (min 6 chars)" value={password} onChange={setPassword} required />

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-medium hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? <LoadingSpinner size="sm" label="Creating account..." /> : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
