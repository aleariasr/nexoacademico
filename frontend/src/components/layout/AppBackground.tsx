export default function AppBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fcff_0%,#e8f7ff_38%,#bfe7f5_72%,#8fcde4_100%)]" />

      <div className="absolute -left-[18%] -top-[22%] h-[820px] w-[820px] rounded-full bg-white/75 blur-3xl" />
      <div className="absolute -right-[18%] top-[8%] h-[760px] w-[760px] rounded-full bg-cyan-200/28 blur-3xl" />
      <div className="absolute bottom-[-35%] left-[12%] h-[820px] w-[820px] rounded-full bg-sky-300/22 blur-3xl" />

      <div className="absolute inset-0 opacity-[0.58] mix-blend-screen bg-[radial-gradient(900px_520px_at_18%_8%,rgba(255,255,255,0.92),transparent_62%),radial-gradient(820px_520px_at_68%_18%,rgba(255,255,255,0.58),transparent_68%)]" />

      <div className="absolute left-[-12%] top-[18%] h-[220px] w-[135%] rotate-[-18deg] rounded-full border-t border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.46),rgba(255,255,255,0.04)_48%,transparent_100%)] blur-[1px] animate-[nexo-wave-one_18s_ease-in-out_infinite_alternate]" />

      <div className="absolute left-[-18%] top-[38%] h-[170px] w-[140%] rotate-[-12deg] rounded-full border-t border-cyan-50/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(186,230,253,0.08)_55%,transparent_100%)] blur-[1px] animate-[nexo-wave-two_22s_ease-in-out_infinite_alternate]" />

      <div className="absolute right-[-8%] top-[-6%] h-[720px] w-[420px] rotate-[18deg] rounded-full border-l border-white/50 bg-[linear-gradient(90deg,rgba(255,255,255,0.28),transparent_58%)] blur-[2px] animate-[nexo-wave-three_24s_ease-in-out_infinite_alternate]" />

      <div className="absolute inset-0 opacity-[0.16] mix-blend-screen bg-[radial-gradient(ellipse_at_22%_28%,rgba(255,255,255,0.42)_0%,transparent_34%),radial-gradient(ellipse_at_74%_38%,rgba(125,211,252,0.24)_0%,transparent_36%),radial-gradient(ellipse_at_48%_72%,rgba(167,243,208,0.18)_0%,transparent_34%)] animate-[nexo-caustics-drift_26s_ease-in-out_infinite_alternate]" />

      <div className="absolute inset-0 opacity-[0.09] mix-blend-overlay bg-[linear-gradient(105deg,transparent_0%,rgba(255,255,255,0.52)_46%,transparent_52%),linear-gradient(72deg,transparent_18%,rgba(186,230,253,0.34)_52%,transparent_58%)] animate-[nexo-refraction-shift_32s_ease-in-out_infinite_alternate]" />

      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[length:5px_5px] opacity-[0.025]" />
    </div>
  );
}