import { ReactNode, useEffect, useRef } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-[100vw] h-[100vh]">
      {children}
    </div>
  );
}
