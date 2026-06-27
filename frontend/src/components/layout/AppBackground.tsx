export default function AppBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--app-background)]" />

      <div className="absolute -left-56 -top-56 h-[680px] w-[680px] rounded-full bg-sky-300/25 blur-3xl" />
      <div className="absolute -right-48 top-0 h-[620px] w-[620px] rounded-full bg-blue-300/20 blur-3xl" />
      <div className="absolute bottom-[-260px] left-[24%] h-[720px] w-[720px] rounded-full bg-white/55 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.28)_34%,transparent_35%)] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[length:4px_4px] opacity-[0.06]" />
    </div>
  );
}