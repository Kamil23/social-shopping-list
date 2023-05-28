import { Dispatch, FormEvent, SetStateAction } from "react";

export default function Input({ value, handleChange, handleSubmit }: { value: string, handleChange: Dispatch<SetStateAction<string>>, handleSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="mt-8">
      <input
        type="input"
        value={value}
        placeholder="Dodaj coś do listy..."
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500 placeholder-gray-400"
      />
    </form>
  );
}
