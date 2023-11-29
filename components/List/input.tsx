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
  itemsCheckedCount
}: {
  value: string;
  handleChange: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  itemsCheckedCount: number;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, 999);
    }
  }, []);
  return (
    <form onSubmit={(e) => handleSubmit(e)} className={`flex py-2 mx-5 items-center ${itemsCheckedCount > 0 ? "pb-[150px]" : ""}`}>
      <Checkbox isChecked={false} isDisabled />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Dodaj nowy element..."
        className="ml-4 w-full px-2 border-none focus:outline-none placeholder-gray-300 text-slate-800 font-anek-latin text-base font-light"
        enterKeyHint="next"
      />
      <label></label>
    </form>
  );
}
