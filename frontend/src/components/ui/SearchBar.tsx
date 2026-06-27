import { Search } from "lucide-react";
import TextInput from "@/components/ui/TextInput";
import type { InputHTMLAttributes } from "react";

type SearchBarProps = InputHTMLAttributes<HTMLInputElement>;

export default function SearchBar(props: SearchBarProps) {
  return <TextInput type="text" icon={<Search size={18} />} {...props} />;
}