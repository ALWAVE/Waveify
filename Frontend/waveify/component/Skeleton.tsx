export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-neutral-800/60 rounded-xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.2s_infinite]"/>
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
