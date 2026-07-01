"use client";

import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Surface from "@/components/ui/Surface";
import {
  login,
  register,
  saveAuthSession,
  type RegisterPayload,
} from "@/services/auth.service";
import { motion } from "framer-motion";

type AuthStatus = "idle" | "loading" | "leaving" | "error";
type AuthMode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const isBusy = status === "loading" || status === "leaving";

  const buttonState =
    status === "loading" ? "loading" : status === "leaving" ? "success" : "idle";

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const data =
        mode === "login"
          ? await login(form.username, form.password)
          : await register(form as RegisterPayload);

      saveAuthSession(data);
      setStatus("leaving");

      window.setTimeout(() => {
        router.push("/dashboard");
      }, 260);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not complete authentication."
      );
      setStatus("error");
    }
  }

  function switchMode() {
    setMode((current) => (current === "login" ? "register" : "login"));
    setStatus("idle");
    setErrorMessage("");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <section className="relative z-10 w-full max-w-[460px]">
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
                {mode === "login" ? "Welcome back" : "Create account"}
              </h1>

              <p className="text-sm text-slate-500">
                {mode === "login"
                  ? "Sign in to manage your academic workspace."
                  : "Register as a student user and start managing courses and tasks."}
              </p>
            </header>

            <div
              className={`space-y-4 transition duration-300 ${
                isBusy ? "opacity-70" : "opacity-100"
              }`}
            >
              <Field label="Username">
                <UserRound size={18} className="text-slate-500" />
                <input
                  value={form.username}
                  onChange={(event) => updateField("username", event.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                  autoComplete="username"
                  placeholder="Username"
                  disabled={isBusy}
                  required
                />
              </Field>

              {mode === "register" && (
                <>
                  <Field label="First name">
                    <UserRound size={18} className="text-slate-500" />
                    <input
                      value={form.first_name}
                      onChange={(event) =>
                        updateField("first_name", event.target.value)
                      }
                      className="h-full min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                      placeholder="First name"
                      disabled={isBusy}
                    />
                  </Field>

                  <Field label="Last name">
                    <UserRound size={18} className="text-slate-500" />
                    <input
                      value={form.last_name}
                      onChange={(event) =>
                        updateField("last_name", event.target.value)
                      }
                      className="h-full min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                      placeholder="Last name"
                      disabled={isBusy}
                    />
                  </Field>

                  <Field label="Email">
                    <Mail size={18} className="text-slate-500" />
                    <input
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      type="email"
                      className="h-full min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                      autoComplete="email"
                      placeholder="email@example.com"
                      disabled={isBusy}
                      required
                    />
                  </Field>
                </>
              )}

              <Field label="Password">
                <LockKeyhole size={18} className="text-slate-500" />
                <input
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  type="password"
                  className="h-full min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  placeholder="Password"
                  disabled={isBusy}
                  required
                  minLength={mode === "register" ? 8 : undefined}
                />
              </Field>

              {mode === "register" && (
                <Field label="Confirm password">
                  <LockKeyhole size={18} className="text-slate-500" />
                  <input
                    value={form.password_confirm}
                    onChange={(event) =>
                      updateField("password_confirm", event.target.value)
                    }
                    type="password"
                    className="h-full min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                    disabled={isBusy}
                    required
                    minLength={8}
                  />
                </Field>
              )}
            </div>

            {status === "error" && (
              <p className="rounded-[18px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-700">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              state={buttonState}
              className="h-12 w-full"
              disabled={isBusy}
            >
              {mode === "login" ? "Continue" : "Create account"}
              <ArrowRight size={18} strokeWidth={2.2} />
            </Button>

            <button
              type="button"
              onClick={switchMode}
              className="w-full text-center text-sm font-semibold text-slate-600 transition hover:text-slate-950"
              disabled={isBusy}
            >
              {mode === "login"
                ? "Need an account? Register"
                : "Already have an account? Sign in"}
            </button>
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