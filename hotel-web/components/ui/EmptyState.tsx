// components/ui/EmptyState.tsx — dipakai semua list (SRS: loading/empty/error wajib ada)
export function EmptyState({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-10 px-4 border rounded-xl bg-gray-50">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SkeletonCard() {
  return <div className="h-32 rounded-xl bg-gray-200 animate-pulse" />;
}
