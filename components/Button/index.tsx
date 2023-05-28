import clsx from "clsx";
import { RiLoader5Fill } from "react-icons/ri";

const Button = ({
  title,
  handler,
  isLoading,
}: {
  title: string;
  handler?: () => void;
  isLoading?: boolean;
}) => (
  <button
    disabled={isLoading}
    onClick={handler}
    className="group relative inline-block focus:outline-none focus:ring w-fit cursor-pointer transition ease-in-out delay-150"
  >
    <span
      className={`absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-y-0 group-hover:translate-x-0 ${clsx(
        {
          ["bg-slate-400"]: isLoading,
        }
      )}`}
    ></span>

    <span
      className={`relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75 ${clsx(
        {
          ["text-slate-600"]: isLoading,
        }
      )}`}
    >
      <div className="flex items-center space-x-8">
        {title}
        {isLoading ? <RiLoader5Fill className="animate-spin ml-4 text-xl" /> : null}
      </div>
    </span>
  </button>
);

export default Button;
