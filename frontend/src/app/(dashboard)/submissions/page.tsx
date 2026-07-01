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
  createSubmission,
  getSubmissions,
  getTasks,
  reviewSubmission,
} from "@/services/academic.service";
import { getStoredUser, getToken, type User } from "@/services/auth.service";
import type { AcademicTask, TaskSubmission } from "@/types/academic";
import { CheckCircle2, FileUp, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function SubmissionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<AcademicTask[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [submitOpen, setSubmitOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<TaskSubmission | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [nextTasks, nextSubmissions] = await Promise.all([
        getTasks(),
        getSubmissions(),
      ]);

      setTasks(nextTasks);
      setSubmissions(nextSubmissions);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not load submissions.");
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
        setUser(getStoredUser());
        void loadData();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [loadData, router]);

  const submittedTaskIds = useMemo(
    () => new Set(submissions.map((submission) => submission.academic_task)),
    [submissions]
  );

  const pendingTasks = tasks.filter((task) => !submittedTaskIds.has(task.id));

  if (loading) {
    return <LoadingState label="Loading submissions" />;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader
        eyebrow={isAdmin ? "Teacher review" : "Student delivery"}
        title="Submissions"
      >
        {!isAdmin && (
          <Button variant="primary" onClick={() => setSubmitOpen(true)}>
            <FileUp size={18} />
            Submit work
          </Button>
        )}
      </PageHeader>

      {error && (
        <GlassCard className="p-5">
          <p className="font-semibold text-slate-950">Unable to load data</p>
          <p className="mt-1 text-sm text-slate-500">{error}</p>
        </GlassCard>
      )}

      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          {isAdmin ? "Student submissions" : "My submissions"}
        </h2>

        {submissions.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {submissions.map((submission) => (
              <GlassCard key={submission.id} className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {submission.task_title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {submission.course_name} · {submission.student_username}
                    </p>
                    {submission.comment && (
                      <p className="mt-3 text-sm text-slate-700">
                        {submission.comment}
                      </p>
                    )}
                    {submission.feedback && (
                      <p className="mt-3 rounded-[18px] bg-white/45 px-4 py-3 text-sm text-slate-700">
                        Feedback: {submission.feedback}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                    <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-slate-700">
                      {submission.status}
                    </span>

                    {submission.grade && (
                      <span className="text-sm font-semibold text-slate-950">
                        Grade: {submission.grade}
                      </span>
                    )}

                    {isAdmin && (
                      <Button
                        variant="glass"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setReviewOpen(true);
                        }}
                      >
                        <CheckCircle2 size={17} />
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title={isAdmin ? "No submissions yet" : "No work submitted yet"}
            description={
              isAdmin
                ? "Student submissions will appear here."
                : "Submit assigned tasks from this page."
            }
          />
        )}
      </GlassCard>

      {!isAdmin && (
        <SubmitWorkModal
          open={submitOpen}
          tasks={pendingTasks}
          onClose={() => setSubmitOpen(false)}
          onSaved={loadData}
        />
      )}

      {isAdmin && (
        <ReviewSubmissionModal
          open={reviewOpen}
          submission={selectedSubmission}
          onClose={() => {
            setReviewOpen(false);
            setSelectedSubmission(null);
          }}
          onSaved={loadData}
        />
      )}
    </div>
  );
}

function SubmitWorkModal({
  open,
  tasks,
  onClose,
  onSaved,
}: {
  open: boolean;
  tasks: AcademicTask[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [taskId, setTaskId] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createSubmission({
        academic_task: Number(taskId),
        comment,
        file,
      });

      onSaved();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not submit work.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Submit work"
      description="Upload or describe your delivery for an assigned task."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">
            Task
          </span>
          <Select
            value={taskId}
            onChange={(event) => setTaskId(event.target.value)}
            required
            className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
          >
            <option value="">Select a task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </Select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">
            Comment
          </span>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            className="w-full rounded-[18px] border border-white/60 bg-white/55 px-4 py-3 text-slate-950 outline-none transition focus:bg-white/80"
            placeholder="Describe what you are submitting..."
          />
        </label>

        <TextInput
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 py-2 text-slate-950 outline-none transition focus:bg-white/80"
        />

        {error && (
          <p className="rounded-[18px] bg-red-500/15 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="glass" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving || !taskId}>
            <Send size={17} />
            {saving ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function ReviewSubmissionModal({
  open,
  submission,
  onClose,
  onSaved,
}: {
  open: boolean;
  submission: TaskSubmission | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open || !submission) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (!submission) {
      setError("No submission selected.");
      setSaving(false);
      return;
    }

    try {
      await reviewSubmission(submission.id, {
        grade: grade || null,
        feedback,
      });

      onSaved();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not review submission.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Review submission"
      description={submission.task_title}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">
            Grade
          </span>
          <TextInput
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
            placeholder={submission.grade ?? "95"}
            className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">
            Feedback
          </span>
          <textarea
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            rows={4}
            placeholder={submission.feedback || "Write feedback for the student..."}
            className="w-full rounded-[18px] border border-white/60 bg-white/55 px-4 py-3 text-slate-950 outline-none transition focus:bg-white/80"
          />
        </label>

        {error && (
          <p className="rounded-[18px] bg-red-500/15 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="glass" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}