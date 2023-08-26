import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import Checkbox from "../Checkbox";

export default function Input({
  value,
  handleChange,
  handleSubmit,
}: {
  value: string;
  handleChange: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, 999);
    }
  }, []);
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex p-2">
      <Checkbox isChecked={false} isDisabled />
      <input
        ref={inputRef}
        type="input"
        value={value}
        // placeholder="Dodaj coś do listy..."
        onChange={(e) => handleChange(e.target.value)}
        className="ml-4 w-full px-2 border-none focus:outline-none placeholder-gray-400 text-slate-800"
      />
      <label></label>
    </form>
  );
}
