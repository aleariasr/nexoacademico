export default function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="nexo-glass rounded-[var(--radius-xl)] px-6 py-5 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--primary)]" />
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
}