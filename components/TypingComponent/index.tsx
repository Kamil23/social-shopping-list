import Checkbox from "../Checkbox";

const TypingComponent = () => {
  return (
    <div className="flex p-2 items-center">
      <Checkbox isChecked={false} isDisabled />
      <div className="ml-5 flex p-1">
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-dotsTyping mr-2"></div>
        <div style={{ animationDelay: '0.2s' }} className="w-3 h-3 bg-gray-500 rounded-full animate-dotsTyping mr-2"></div>
        <div style={{ animationDelay: '0.4s' }}  className="w-3 h-3 bg-gray-500 rounded-full animate-dotsTyping mr-2"></div>
      </div>
    </div>
  );
}

export default TypingComponent;