import clsx from "clsx";
import { RiLoader5Fill } from "react-icons/ri";

const Button = ({
  title,
  handler,
  isLoading,
  bgStyle,
  textStyle,
  icon,
  additionalStyle,
}: {
  title: string;
  handler?: () => void;
  isLoading?: boolean;
  bgStyle?: string;
  textStyle?: string;
  icon?: JSX.Element;
  additionalStyle?: Record<string, unknown>;
}) => (
  <button
    disabled={isLoading}
    onClick={handler}
    className={`w-[70vw] flex justify-center items-center space-x-2 focus:outline-none cursor-pointer transition ease-in-out delay-150 p-4 rounded-lg ${clsx({
      ["bg-neutral-500"]: isLoading,
    })} ${bgStyle}`}
    style={additionalStyle}
  >
    {isLoading ? (
      <RiLoader5Fill className="animate-spin text-sm text-white-on-blue" />
    ) : (
      <>
      {icon}
      </>
    )}
    <span
      className={`font-medium text-sm ${textStyle}`}
    >
      {title}
    </span>
  </button>
);

export default Button;
