import clsx from "clsx";
import { RiLoader5Fill } from "react-icons/ri";

const Button = ({
  title,
  handler,
  isLoading,
  bgStyle,
  textStyle,
  icon,
}: {
  title: string;
  handler?: () => void;
  isLoading?: boolean;
  bgStyle?: string;
  textStyle?: string;
  icon?: JSX.Element;
}) => (
  <button
    disabled={isLoading}
    onClick={handler}
    className={`w-[70vw] flex justify-center items-center space-x-2 focus:outline-none cursor-pointer transition ease-in-out delay-150 p-6 rounded-lg ${clsx({
      ["bg-neutral-500"]: isLoading,
    })} ${bgStyle}`}
  >
    {isLoading ? (
      <RiLoader5Fill className="animate-spin text-sm" />
    ) : (
      <>
      {icon}
      </>
    )}
    <span
      className={`font-medium ${textStyle}`}
    >
      {title}
    </span>
  </button>
);

export default Button;
