"use client";

import TaskModal from "@/components/tasks/TaskModal";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import LoadingState from "@/components/ui/LoadingState";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import Select from "@/components/ui/Select";
import TextInput from "@/components/ui/TextInput";
import {
  createEnrollment,
  createSubmission,
  getCourse,
  getCourseEnrollments,
  getCourseSubmissions,
  getTasks,
  reviewSubmission,
} from "@/services/academic.service";
import {
  getStoredUser,
  getToken,
  getUsers,
  type User,
} from "@/services/auth.service";
import type {
  AcademicTask,
  Course,
  CourseEnrollment,
  TaskSubmission,
} from "@/types/academic";
import {
  ArrowLeft,
  FileText,
  Plus,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type CourseDetailState = {
  course: Course | null;
  tasks: AcademicTask[];
  enrollments: CourseEnrollment[];
  submissions: TaskSubmission[];
  loading: boolean;
  error: string | null;
};

const initialState: CourseDetailState = {
  course: null,
  tasks: [],
  enrollments: [],
  submissions: [],
  loading: true,
  error: null,
};

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const courseId = Number(params.id);

  const [state, setState] = useState<CourseDetailState>(initialState);
  const [user, setUser] = useState<User | null>(null);
  const [reviewSubmissionItem, setReviewSubmissionItem] =
    useState<TaskSubmission | null>(null);
  const [submitTaskItem, setSubmitTaskItem] = useState<AcademicTask | null>(
    null
  );
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const loadCourse = useCallback(async () => {
    try {
      const [course, tasks, enrollments, submissions] = await Promise.all([
        getCourse(courseId),
        getTasks(courseId),
        getCourseEnrollments(courseId),
        getCourseSubmissions(courseId),
      ]);

      setState({
        course,
        tasks,
        enrollments,
        submissions,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : "Could not load course.",
      }));
    }
  }, [courseId]);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setUser(getStoredUser());
      void loadCourse();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadCourse, router]);

  const course = state.course;

  const canManage =
    Boolean(course) &&
    (user?.role === "admin" ||
      (user?.role === "professor" && course?.professor_user === user.id));

  const submissionByTask = useMemo(() => {
    return new Map(
      state.submissions.map((submission) => [
        submission.academic_task,
        submission,
      ])
    );
  }, [state.submissions]);

  if (state.loading) {
    return <LoadingState label="Loading course" />;
  }

  if (!course) {
    return (
      <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
        <PageHeader title="Course not found" />

        <EmptyState
          title="No course available"
          description={state.error || "The selected course could not be loaded."}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-24 md:pb-0">
      <PageHeader eyebrow={course.code} title={course.name}>
        <div className="flex flex-wrap gap-2">
          {canManage && (
            <>
              <Button variant="glass" onClick={() => setEnrollModalOpen(true)}>
                <UserPlus size={17} />
                Enroll student
              </Button>

              <Button variant="primary" onClick={() => setTaskModalOpen(true)}>
                <Plus size={17} />
                New assignment
              </Button>
            </>
          )}

          <Button variant="glass" onClick={() => router.push("/courses")}>
            <ArrowLeft size={17} />
            Back
          </Button>
        </div>
      </PageHeader>

      <GlassCard className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <InfoItem
            label="Assigned user"
            value={course.professor_username || "None"}
          />
          <InfoItem label="Credits" value={`${course.credits}`} />
        </div>
      </GlassCard>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <AssignmentsPanel
          tasks={state.tasks}
          canManage={canManage}
          submissionByTask={submissionByTask}
          onSubmit={setSubmitTaskItem}
        />

        <StudentsPanel enrollments={state.enrollments} />
      </div>

      {canManage && (
        <SubmissionsPanel
          submissions={state.submissions}
          onReview={setReviewSubmissionItem}
        />
      )}

      <ReviewSubmissionModal
        submission={reviewSubmissionItem}
        onClose={() => setReviewSubmissionItem(null)}
        onSaved={loadCourse}
      />

      <SubmitAssignmentModal
        task={submitTaskItem}
        onClose={() => setSubmitTaskItem(null)}
        onSaved={loadCourse}
      />

      <TaskModal
        open={taskModalOpen}
        courses={[course]}
        onClose={() => setTaskModalOpen(false)}
        onSaved={loadCourse}
      />

      <EnrollStudentModal
        open={enrollModalOpen}
        course={course}
        onClose={() => setEnrollModalOpen(false)}
        onSaved={loadCourse}
      />
    </div>
  );
}

function AssignmentsPanel({
  tasks,
  canManage,
  submissionByTask,
  onSubmit,
}: {
  tasks: AcademicTask[];
  canManage: boolean;
  submissionByTask: Map<number, TaskSubmission>;
  onSubmit: (task: AcademicTask) => void;
}) {
  return (
    <GlassCard className="p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          Assignments
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Work published for this course.
        </p>
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => {
            const submission = submissionByTask.get(task.id);

            return (
              <div
                key={task.id}
                className="rounded-[22px] border border-white/40 bg-white/30 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-950">{task.title}</p>

                    <p className="mt-1 text-sm text-slate-500">
                      {task.task_type_name} · {formatDate(task.due_date)}
                    </p>

                    {task.description && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {task.description}
                      </p>
                    )}

                    {!canManage && submission && (
                      <div className="mt-4 rounded-[18px] bg-white/45 px-4 py-3 text-sm text-slate-700">
                        <p className="font-semibold text-slate-950">
                          Submission status: {submission.status}
                        </p>

                        {submission.grade && (
                          <p className="mt-2">
                            Grade:{" "}
                            <span className="font-semibold">
                              {submission.grade}
                            </span>
                          </p>
                        )}

                        {submission.feedback && (
                          <p className="mt-2">Feedback: {submission.feedback}</p>
                        )}

                        {submission.file && (
                          <a
                            href={submission.file}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#0A84FF] hover:underline"
                          >
                            <FileText size={16} />
                            Open submitted file
                          </a>
                        )}
                      </div>
                    )}

                    {!canManage && !submission && (
                      <Button
                        variant="primary"
                        className="mt-4"
                        onClick={() => onSubmit(task)}
                      >
                        Submit assignment
                      </Button>
                    )}
                  </div>

                  {task.is_overdue && (
                    <span className="shrink-0 rounded-full bg-red-500/12 px-3 py-1 text-xs font-semibold text-red-700">
                      Overdue
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No assignments"
          description={
            canManage
              ? "Create the first assignment for this course."
              : "Assignments from your professor will appear here."
          }
        />
      )}
    </GlassCard>
  );
}

function StudentsPanel({ enrollments }: { enrollments: CourseEnrollment[] }) {
  return (
    <GlassCard className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 ring-1 ring-white/50">
          <Users size={18} />
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Students
          </h2>
          <p className="text-sm text-slate-500">
            {enrollments.length} enrolled
          </p>
        </div>
      </div>

      {enrollments.length > 0 ? (
        <div className="space-y-3">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="rounded-[20px] bg-white/30 p-4 ring-1 ring-white/40"
            >
              <div className="flex items-center gap-3">
                <UserRound size={17} className="text-slate-500" />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">
                    {enrollment.student_username}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {enrollment.student_email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No students"
          description="No students are enrolled in this course yet."
        />
      )}
    </GlassCard>
  );
}

function SubmissionsPanel({
  submissions,
  onReview,
}: {
  submissions: TaskSubmission[];
  onReview: (submission: TaskSubmission) => void;
}) {
  return (
    <GlassCard className="p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          Submissions
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Student work submitted for this course.
        </p>
      </div>

      {submissions.length > 0 ? (
        <div className="grid gap-3">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="rounded-[22px] border border-white/40 bg-white/30 p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-950">
                    {submission.task_title}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {submission.student_username} · {submission.status}
                  </p>

                  {submission.comment && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {submission.comment}
                    </p>
                  )}

                  {submission.feedback && (
                    <p className="mt-3 rounded-[18px] bg-white/45 px-4 py-3 text-sm text-slate-700">
                      Feedback: {submission.feedback}
                    </p>
                  )}

                  {submission.file && (
                    <a
                      href={submission.file}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0A84FF] hover:underline"
                    >
                      <FileText size={16} />
                      Open submitted file
                    </a>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
                  {submission.grade && (
                    <span className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-slate-700">
                      Grade: {submission.grade}
                    </span>
                  )}

                  <Button variant="primary" onClick={() => onReview(submission)}>
                    Review
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No submissions"
          description="Student submissions for this course will appear here."
        />
      )}
    </GlassCard>
  );
}

function EnrollStudentModal({
  open,
  course,
  onClose,
  onSaved,
}: {
  open: boolean;
  course: Course;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [students, setStudents] = useState<User[]>([]);
  const [studentId, setStudentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(() => {
      setStudentId("");
      setError("");

      void getUsers("student")
        .then(setStudents)
        .catch(() => setStudents([]));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createEnrollment({
        course: course.id,
        student: Number(studentId),
      });

      await onSaved();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not enroll student.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Enroll student"
      description={`${course.code} · ${course.name}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">
            Student
          </span>

          <Select
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            required
            className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 text-slate-950 outline-none transition focus:bg-white/80"
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name || student.last_name
                  ? `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim()
                  : student.username}
              </option>
            ))}
          </Select>
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

          <Button variant="primary" type="submit" disabled={saving || !studentId}>
            {saving ? "Enrolling..." : "Enroll student"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function SubmitAssignmentModal({
  task,
  onClose,
  onSaved,
}: {
  task: AcademicTask | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!task) return;

    const timeoutId = window.setTimeout(() => {
      setComment("");
      setFile(null);
      setError("");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [task]);

  if (!task) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (!task) {
      setError("No assignment selected.");
      setSaving(false);
      return;
    }

    try {
      await createSubmission({
        academic_task: task.id,
        comment,
        file,
      });

      await onSaved();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not submit assignment."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={Boolean(task)}
      title="Submit assignment"
      description={task.title}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">
            Comment
          </span>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            className="w-full rounded-[18px] border border-white/60 bg-white/55 px-4 py-3 text-slate-950 outline-none transition focus:bg-white/80"
            placeholder="Add a note for your professor..."
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-600">
            File
          </span>

          <TextInput
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="h-12 w-full rounded-[18px] border border-white/60 bg-white/55 px-4 py-2 text-slate-950 outline-none transition focus:bg-white/80"
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
            {saving ? "Submitting..." : "Submit assignment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function ReviewSubmissionModal({
  submission,
  onClose,
  onSaved,
}: {
  submission: TaskSubmission | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!submission) return;

    const timeoutId = window.setTimeout(() => {
      setGrade(submission.grade ?? "");
      setFeedback(submission.feedback ?? "");
      setError("");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [submission]);

  if (!submission) return null;

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

      await onSaved();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not review submission."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={Boolean(submission)}
      title="Review submission"
      description={`${submission.student_username} · ${submission.task_title}`}
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
            placeholder="95"
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
            className="w-full rounded-[18px] border border-white/60 bg-white/55 px-4 py-3 text-slate-950 outline-none transition focus:bg-white/80"
          />
        </label>

        {submission.file && (
          <a
            href={submission.file}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A84FF] hover:underline"
          >
            <FileText size={16} />
            Open submitted file
          </a>
        )}

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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/40 bg-white/25 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}