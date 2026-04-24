import React from "react";
export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } } .loading-pulse { animation: pulse 1.5s ease-in-out infinite; }`}</style>
      <div className="retro-box p-8 text-center"><div className="loading-pulse text-2xl font-bold">LOADING...</div></div>
    </div>
  );
}