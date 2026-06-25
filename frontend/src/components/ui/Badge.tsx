type BadgeProps = {
  children: React.ReactNode;
};

export default function Badge({
  children,
}: BadgeProps) {
  return (
    <span
      className="
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-sm
        font-medium
        bg-[var(--primary-container)]
        text-[var(--on-primary-container)]
      "
    >
      {children}
    </span>
  );
}