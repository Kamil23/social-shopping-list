import Checkbox from "../Checkbox";

const TypingComponent = () => (
  <div className="flex px-4 py-6 items-center ml-5">
    <Checkbox isChecked={false} isDisabled />
    <div className="ml-5 flex p-1">
      <div className="w-3 h-3 bg-primary-blue rounded-full animate-dotsTyping mr-2"></div>
      <div
        style={{ animationDelay: "0.2s" }}
        className="w-3 h-3 bg-primary-blue rounded-full animate-dotsTyping mr-2"
      ></div>
      <div
        style={{ animationDelay: "0.4s" }}
        className="w-3 h-3 bg-primary-blue rounded-full animate-dotsTyping mr-2"
      ></div>
    </div>
  </div>
);

export default TypingComponent;
