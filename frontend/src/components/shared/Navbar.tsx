import { Menu } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { auth, getInitials } from "@/lib/auth";

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const user = auth.getUser();

  const handleLogout = () => {
    auth.clear();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex-1 lg:pl-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Welcome back,{" "}
            <span className="text-foreground font-medium">
              {user?.name ?? "Guest"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium leading-tight">{user?.name}</div>
            <div className="text-xs text-muted-foreground leading-tight">
              {user?.email}
            </div>
          </div>
          <div
            className="size-10 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground glow-shadow"
            title={user?.name ?? ""}
          >
            {getInitials(user?.name).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:inline-flex text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
