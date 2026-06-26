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
              "radial-gradient(circle at 45% 52%, rgba(255,255,255,0.10), transparent 34%), linear-gradient(135deg, rgb(5,5,7), rgb(14,8,14))",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute h-[980px] w-[980px] rounded-full"
          style={{
            left: "-240px",
            top: "-260px",
            background:
              "radial-gradient(circle, rgba(255,42,120,0.82) 0%, rgba(255,42,120,0.52) 32%, transparent 68%)",
            animation: "login-hot-blob-one 18s ease-in-out infinite",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute h-[1040px] w-[1040px] rounded-full"
          style={{
            right: "-300px",
            top: "-240px",
            background:
              "radial-gradient(circle, rgba(255,88,150,0.72) 0%, rgba(255,88,150,0.46) 34%, transparent 70%)",
            animation: "login-hot-blob-two 22s ease-in-out infinite",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute h-[900px] w-[900px] rounded-full"
          style={{
            left: "18%",
            bottom: "-390px",
            background:
              "radial-gradient(circle, rgba(130,48,255,0.58) 0%, rgba(130,48,255,0.34) 34%, transparent 70%)",
            animation: "login-hot-blob-three 20s ease-in-out infinite",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute h-[760px] w-[760px] rounded-full"
          style={{
            right: "20%",
            bottom: "-260px",
            background:
              "radial-gradient(circle, rgba(255,245,235,0.38) 0%, rgba(255,245,235,0.22) 32%, transparent 68%)",
            animation: "login-hot-blob-four 15s ease-in-out infinite",
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

      <section className="relative z-10 w-full max-w-[900px]">
        <AppleLiquidGlass className="h-[430px] w-full" radius={42}>
          <form onSubmit={handleSubmit} className="relative z-10 p-10">
            <div
              className="flex flex-col justify-center"
              style={{ textShadow: "0 4px 26px rgba(0,0,0,0.65)" }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                NexoAcadémico
              </p>

              <h1
                className="mt-4 text-6xl font-semibold tracking-[-0.06em]"
                style={{ color: "rgb(255,255,255)" }}
              >
                Sign in
              </h1>

              <p
                className="mt-5 max-w-[330px] text-sm leading-6"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                Access your academic workspace and manage courses, tasks and
                progress from one place.
              </p>
            </div>

            <div className="mt-8">
              <div className="space-y-4">
                <FieldLabel label="Username">
                  <InputShell>
                    <UserRound
                      size={18}
                      style={{ color: "rgba(255,255,255,0.78)" }}
                    />

                    <input
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="h-full min-w-0 flex-1 bg-transparent outline-none"
                      style={{ color: "rgb(255,255,255)" }}
                      autoComplete="username"
                      required
                    />
                  </InputShell>
                </FieldLabel>

                <FieldLabel label="Password">
                  <InputShell>
                    <LockKeyhole
                      size={18}
                      style={{ color: "rgba(255,255,255,0.78)" }}
                    />

                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type="password"
                      className="h-full min-w-0 flex-1 bg-transparent outline-none"
                      style={{ color: "rgb(255,255,255)" }}
                      autoComplete="current-password"
                      required
                    />
                  </InputShell>
                </FieldLabel>
              </div>

              {status === "error" && (
                <p
                  className="mt-4 rounded-[16px] px-4 py-3 text-sm font-medium"
                  style={{
                    background: "rgba(239,68,68,0.28)",
                    color: "rgb(255,255,255)",
                  }}
                >
                  Could not sign in. Check your credentials or backend endpoint.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-[19px] text-sm font-semibold shadow-[0_28px_90px_rgba(0,0,0,0.22)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background: "rgba(255,255,255,0.94)",
                  color: "rgb(15,23,42)",
                }}
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
      className="mt-2 flex h-13 items-center gap-3 rounded-[19px] px-4 transition"
      style={{
        border: "1px solid rgba(255,255,255,0.20)",
        background: "rgba(0,0,0,0.34)",
        backdropFilter: "blur(18px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
      }}
    >
      {children}
    </div>
  );
}