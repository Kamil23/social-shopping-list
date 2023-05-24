import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="p-4 w-[100vw] h-[100vh]">{children}</div>;
}
