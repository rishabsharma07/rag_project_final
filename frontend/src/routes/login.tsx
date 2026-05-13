import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.loginUser({ email, password });
      auth.setSession(res.access_token, res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
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
        <h1 className="text-2xl font-semibold text-center">Welcome back</h1>
        <p className="text-sm text-muted-foreground text-center mt-1.5">
          Login to continue your learning journey
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <AuthField
            icon={Mail}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={setEmail}
            required
          />
          <AuthField
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-medium hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? <LoadingSpinner size="sm" label="Signing in..." /> : "Login"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export function AuthField({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <Icon className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-input border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}
