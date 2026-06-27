import Button from "@/components/ui/Button";
import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function IconButton({ children, ...props }: IconButtonProps) {
  return (
    <Button variant="glass" size="icon" {...props}>
      {children}
    </Button>
  );
}