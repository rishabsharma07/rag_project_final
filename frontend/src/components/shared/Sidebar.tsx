import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Map,
  Brain,
  Upload,
  MessageSquare,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/quiz", label: "Quiz", icon: Brain },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/chat", label: "Chat", icon: MessageSquare },
] as const;

export function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = () => {
    auth.clear();
    navigate({ to: "/login" });
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 shrink-0",
          "glass border-r border-border flex flex-col",
          "transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="size-9 rounded-xl gradient-primary flex items-center justify-center glow-shadow">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold leading-tight">Career</div>
              <div className="text-xs text-muted-foreground -mt-0.5">Copilot</div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-primary/15 text-foreground border border-primary/30"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
