import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMenuClick={() => setOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
