import { Item } from "@/types/sessionList";
import { ReactNode, useEffect, useRef } from "react";

export default function Layout({ children, list }: { children: ReactNode; list: Item[] }) {
  const scrollRef = useRef(null);
  const scrollToBottom = () => {
    //@ts-ignore
    const { scrollHeight, clientHeight }: { scrollHeight: number, clientHeight: number} = scrollRef.current;
    window.scrollTo(0, scrollHeight - clientHeight);
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [list]);
  
  return (
    <div className="w-[100vw] h-[100vh]" ref={scrollRef}>
      {children}
    </div>
  );
}
