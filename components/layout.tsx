import { ReactNode } from "react";
import { motion } from "framer-motion";
import CanvasConfetti from "./CanvasConfetti";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-[100vh] h-auto w-[100vw]"
    >
      {children}
      <CanvasConfetti />
    </motion.div>
  );
}
