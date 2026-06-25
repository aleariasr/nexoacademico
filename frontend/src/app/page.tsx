import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function Home() {
  return (
    <AppShell>
      <main className="flex min-h-[calc(100vh-4rem)] items-center">
        <section className="grid w-full gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <Card className="p-8 md:p-10">
            <div className="flex max-w-3xl flex-col gap-6">
              <span className="w-fit rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm">
                Academic workspace
              </span>

              <h1 className="text-5xl font-semibold tracking-tight text-zinc-950 md:text-7xl">
                Study flow,
                <br />
                beautifully organized.
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                Manage courses, tasks, deadlines and academic progress from a
                clean workspace built to feel fast, focused and native.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button>Get Started</Button>
                <Button variant="secondary">View Dashboard</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-zinc-500">Today</p>
                <h2 className="mt-1 text-2xl font-semibold">Focus overview</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Stat value="1" label="Active course" />
                <Stat value="1" label="Pending task" />
                <Stat value="0" label="Overdue" />
                <Stat value="0%" label="Complete" />
              </div>

              <div className="rounded-[28px] bg-white/55 p-5 shadow-sm">
                <p className="font-medium">Database Backup Practice</p>
                <p className="mt-1 text-sm text-zinc-500">
                  High priority · July 3, 2026
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </AppShell>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] bg-white/55 p-4 shadow-sm">
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  );
}