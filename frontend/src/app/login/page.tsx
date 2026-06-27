"use client";

import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AppleLiquidGlass from "@/components/liquid-glass/AppleLiquidGlass";
import LiquidGlassRenderer from "@/components/liquid-glass/LiquidGlassRenderer";
import { login, saveAuthSession } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const data = await login(username, password);
      saveAuthSession(data);
      router.push("/dashboard");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div
        id="liquid-snapshot-source"
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden"
        style={{
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 24% 22%, rgba(96,165,250,0.18), transparent 22%), radial-gradient(circle at 78% 18%, rgba(56,189,248,0.16), transparent 18%), radial-gradient(circle at 52% 58%, rgba(255,255,255,0.12), transparent 36%), linear-gradient(135deg, rgb(3,11,26), rgb(8,15,31) 55%, rgb(10,20,38))",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute h-[980px] w-[980px] rounded-full"
          style={{
            left: "-280px",
            top: "-300px",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.78) 0%, rgba(56,189,248,0.34) 30%, transparent 68%)",
            animation: "login-cool-blob-one 20s ease-in-out infinite",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute h-[1040px] w-[1040px] rounded-full"
          style={{
            right: "-320px",
            top: "-260px",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.68) 0%, rgba(59,130,246,0.30) 34%, transparent 70%)",
            animation: "login-cool-blob-two 24s ease-in-out infinite",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute h-[900px] w-[900px] rounded-full"
          style={{
            left: "14%",
            bottom: "-420px",
            background:
              "radial-gradient(circle, rgba(125,211,252,0.50) 0%, rgba(125,211,252,0.22) 34%, transparent 70%)",
            animation: "login-cool-blob-three 22s ease-in-out infinite",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute h-[760px] w-[760px] rounded-full"
          style={{
            right: "16%",
            bottom: "-280px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.10) 32%, transparent 68%)",
            animation: "login-cool-blob-four 17s ease-in-out infinite",
          }}
        />

        <div
          aria-hidden="true"
          className="liquid-login-noise pointer-events-none absolute inset-0"
          style={{
            opacity: 0.1,
            mixBlendMode: "soft-light",
          }}
        />
      </div>

      <LiquidGlassRenderer />

      <section className="relative z-10 w-full max-w-[760px]">
        <AppleLiquidGlass className="min-h-[640px] w-full" radius={42}>
          <form onSubmit={handleSubmit} className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
            <div className="space-y-6 text-white" style={{ textShadow: "0 4px 24px rgba(0,0,0,0.28)" }}>
              <span className="inline-flex w-fit items-center rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200/90">
                NexoAcadémico
              </span>

            </div>

            <div className="mt-8 space-y-4">
              <FieldLabel label="Username">
                <InputShell>
                  <UserRound size={18} className="text-slate-300/80" />

                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-300/45"
                    autoComplete="username"
                    placeholder="yourname"
                    required
                  />
                </InputShell>
              </FieldLabel>

              <FieldLabel label="Password">
                <InputShell>
                  <LockKeyhole size={18} className="text-slate-300/80" />

                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="h-full min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-300/45"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                </InputShell>
              </FieldLabel>

              {status === "error" && (
                <p className="rounded-[18px] border border-rose-400/20 bg-rose-400/12 px-4 py-3 text-sm font-medium text-rose-50">
                  Could not sign in. Check your credentials or backend endpoint.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-[20px] border border-white/15 bg-white/92 text-sm font-semibold text-slate-950 shadow-[0_24px_80px_rgba(2,8,23,0.24)] transition hover:-translate-y-[1px] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Signing in..." : "Sign in"}
                <ArrowRight size={18} strokeWidth={2.2} />
              </button>
            </div>
          </form>
        </AppleLiquidGlass>
      </section>
    </main>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span
        className="text-sm font-medium"
        style={{
          color: "rgba(255,255,255,0.88)",
          textShadow: "0 2px 14px rgba(0,0,0,0.55)",
        }}
      >
        {label}
      </span>

      {children}
    </label>
  );
}

function InputShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-2 flex h-13 items-center gap-3 rounded-[20px] border border-white/14 bg-white/8 px-4 transition"
      style={{
        backdropFilter: "blur(18px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </div>
  );
}
