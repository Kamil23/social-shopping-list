import { ReactNode } from "react";
import ListHeader from "./List/header";

export default function Layout({ children }: { children: ReactNode; }) {
  
  return (
    <div className="w-[100vw] h-[100vh]">
      <ListHeader updatedAt={""} />
      {children}
    </div>
  );
}
