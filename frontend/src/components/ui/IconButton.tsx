import type { MotionButtonProps } from "@/types/ui";

import Button from "@/components/ui/Button";

type IconButtonProps = MotionButtonProps & {
  children: React.ReactNode;
};

export default function IconButton({ children, ...props }: IconButtonProps) {
  return (
    <Button variant="glass" size="icon" {...props}>
      {children}
    </Button>
  );
}