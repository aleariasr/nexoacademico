"use client";

import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import LoadingState from "@/components/ui/LoadingState";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import Select from "@/components/ui/Select";
import TextInput from "@/components/ui/TextInput";
import {
  createManagedUser,
  getManagedUsers,
  getStoredUser,
  getToken,
  type ManagedUser,
  type ManagedUserPayload,
} from "@/services/auth.service";
import { Plus, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const initialForm: ManagedUserPayload = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  is_active: true,
  role: "student",
  degree_program: "",
};

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const nextUsers = await getManagedUsers();
      setUsers(nextUsers);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const user = getStoredUser();

      if (user?.role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadUsers, router]);

  const groupedUsers = useMemo(() => {
    return {
      admin: users.filter((user) => user.profile_role === "admin"),
      professor: users.filter((user) => user.profile_role === "professor"),
      student: users.filter((user) => user.profile_role === "student"),
      missing: users.filter((user) => !user.profile_role),
    };
  }, [users]);

  if (loading) {
    return <LoadingState label="Loading users" />;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader eyebrow="Administration" title="Users">
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} />
          New User
        </Button>
      </PageHeader>

      {error && (
        <GlassCard className="p-5">
          <p className="font-semibold text-slate-950">Unable to load users</p>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
        </GlassCard>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <UserGroup title="Administrators" users={groupedUsers.admin} />
        <UserGroup title="Professors" users={groupedUsers.professor} />
        <UserGroup title="Students" users={groupedUsers.student} />
        <UserGroup title="Missing role" users={groupedUsers.missing} />
      </div>

      <CreateUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={loadUsers}
      />
    </div>
  );
}

function UserGroup({ title, users }: { title: string; users: ManagedUser[] }) {
  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h2>

      {users.length > 0 ? (
        <div className="mt-4 space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-[22px] border border-white/40 bg-white/30 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/50 text-slate-700 ring-1 ring-white/50">
                  <UserRound size={18} />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">
                    {user.first_name || user.last_name
                      ? `${user.first_name} ${user.last_name}`.trim()
                      : user.username}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    @{user.username} · {user.email}
                  </p>
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {user.profile_degree_program || "No degree program"} ·{" "}
                    {user.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No users" description="No accounts in this group." />
      )}
    </GlassCard>
  );
}

function CreateUserModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ManagedUserPayload>(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(() => {
      setForm(initialForm);
      setError("");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  if (!open) return null;

  function updateField<K extends keyof ManagedUserPayload>(
    field: K,
    value: ManagedUserPayload[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createManagedUser(form);
      await onSaved();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not create user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Create user"
      description="Create administrator, professor or student accounts."
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Username">
            <TextInput
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              required
              className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
            />
          </Field>

          <Field label="Email">
            <TextInput
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
              className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <TextInput
              value={form.first_name}
              onChange={(event) => updateField("first_name", event.target.value)}
              className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
            />
          </Field>

          <Field label="Last name">
            <TextInput
              value={form.last_name}
              onChange={(event) => updateField("last_name", event.target.value)}
              className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password">
            <TextInput
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              required
              minLength={8}
              className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
            />
          </Field>

          <Field label="Role">
            <Select
              value={form.role}
              onChange={(event) =>
                updateField(
                  "role",
                  event.target.value as ManagedUserPayload["role"]
                )
              }
              className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
              <option value="admin">Administrator</option>
            </Select>
          </Field>
        </div>

        <Field label="Degree program">
          <TextInput
            value={form.degree_program}
            onChange={(event) => updateField("degree_program", event.target.value)}
            placeholder="Informática Empresarial"
            className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
          />
        </Field>

        {error && (
          <p className="rounded-[18px] bg-red-500/15 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-white/20 pt-6">
          <Button variant="glass" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create user"}
          </Button>
        </div>
      </form>
    </Modal>
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
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}