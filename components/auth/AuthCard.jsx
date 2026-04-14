export default function AuthCard({ children }) {
  return (
    <div className="card w-full max-w-lg bg-[#161b22] border border-white/10 rounded-xl p-8">
      {children}
    </div>
  );
}