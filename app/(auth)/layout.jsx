import AuthCard from "@/components/auth/AuthCard";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">

      <header className="py-4 text-center">
        <span className="font-bold text-white text-lg tracking-tight">
          Sovereign Observer
        </span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 relative">
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-teal-900/20 blur-[120px] pointer-events-none" />
        <AuthCard>{children}</AuthCard>
      </main>

      <footer className="py-6 text-center space-y-2">
        <div className="flex justify-center gap-6 text-xs text-gray-500 tracking-widest font-mono uppercase">
          <a href="#">Privacy Policy</a>
          <span>|</span>
          <a href="#">Terms of Service</a>
          <span>|</span>
          <a href="#">Security Architecture</a>
        </div>
        <p className="text-xs text-gray-600 font-mono tracking-widest uppercase">
          2026 AIOPS monitoring, Inc. All rights reserved.
        </p>
      </footer>

    </div>
  );
}