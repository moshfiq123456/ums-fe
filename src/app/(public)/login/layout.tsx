"use client";

import PublicGate from "@/hoc/publicGate";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicGate>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
        {children}
      </div>
    </PublicGate>
  );
}
