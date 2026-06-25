"use client";

import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppleLiquidGlass from "@/components/liquid-glass/AppleLiquidGlass";
import LiquidBackground from "@/components/liquid-glass/LiquidBackground";
import LiquidGlassRenderer from "@/components/liquid-glass/LiquidGlassRenderer";

type LoginResponse = {
  token: string;
  user?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(`${apiUrl}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = (await response.json()) as LoginResponse;

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push("/dashboard");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{ background: "rgb(5,5,7)" }}
    >
      <LiquidBackground />
      <LiquidGlassRenderer />

      <section className="relative z-10 w-full max-w-[760px]">
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