"use client";

import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import GlassCard from "@/components/ui/GlassCard";
import { login, saveAuthSession } from "@/services/auth.service";
import Surface from "@/components/ui/Surface";
import Button from "@/components/ui/Button";

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
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <section className="relative z-10 w-full max-w-[420px]">
        <GlassCard radius="liquid" variant="floating" className="p-8 md:p-9">
          <form onSubmit={handleSubmit} className="space-y-7">
            <header className="space-y-2 text-center">
              <p className="text-sm font-semibold tracking-[0.22em] text-slate-500">
                NEXOACADÉMICO
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Welcome back
              </h1>
            </header>

            <div className="space-y-4">
              <Field label="Username">
                <UserRound size={18} className="text-slate-500" />

                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                  autoComplete="username"
                  placeholder="Username"
                  disabled={status === "loading"}
                  required
                />
              </Field>

              <Field label="Password">
                <LockKeyhole size={18} className="text-slate-500" />

                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="h-full min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                  autoComplete="current-password"
                  placeholder="Password"
                  disabled={status === "loading"}
                  required
                />
              </Field>
            </div>

            {status === "error" && (
              <p className="rounded-[18px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-700">
                Could not sign in. Check your credentials or backend endpoint.
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="h-12 w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing in" : "Continue"}
              <ArrowRight size={18} strokeWidth={2.2} />
            </Button>
          </form>
        </GlassCard>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>

      <Surface
        variant="input"
        radius="full"
        className="flex h-12 items-center gap-3 px-4"
      >
        {children}
      </Surface>
    </label>
  );
}