"use client";

import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Surface from "@/components/ui/Surface";
import { login, saveAuthSession } from "@/services/auth.service";
import { motion } from "framer-motion";

type LoginStatus = "idle" | "loading" | "leaving" | "error";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");

  const isBusy = status === "loading" || status === "leaving";

  const buttonState =
    status === "loading" ? "loading" : status === "leaving" ? "success" : "idle";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const data = await login(username, password);
      saveAuthSession(data);
      setStatus("leaving");

      window.setTimeout(() => {
        router.push("/dashboard");
      }, 260);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <section className="relative z-10 w-full max-w-[420px]">
        <GlassCard radius="liquid" variant="floating" className="p-8 md:p-9">
          <motion.form
            onSubmit={handleSubmit}
            animate={{
              opacity: status === "leaving" ? 0.82 : 1,
              scale: status === "leaving" ? 0.985 : 1,
              filter: status === "leaving" ? "blur(0.2px)" : "blur(0px)",
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 34,
              mass: 0.8,
            }}
            className="space-y-7"
          >
            <header className="space-y-2 text-center">
              <p className="text-sm font-semibold tracking-[0.22em] text-slate-500">
                NEXOACADÉMICO
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                Welcome back
              </h1>
            </header>

            <div
              className={`space-y-4 transition duration-300 ${
                isBusy ? "opacity-70" : "opacity-100"
              }`}
            >
              <Field label="Username">
                <UserRound size={18} className="text-slate-500" />

                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                  autoComplete="username"
                  placeholder="Username"
                  disabled={isBusy}
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
                  disabled={isBusy}
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
              state={buttonState}
              className="h-12 w-full"
              disabled={isBusy}
            >
              Continue
              <ArrowRight size={18} strokeWidth={2.2} />
            </Button>
          </motion.form>
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