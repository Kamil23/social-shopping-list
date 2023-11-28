import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { motion } from "framer-motion";
import { ConfettiProvider } from "@/hooks/useConfetti";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfettiProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Component {...pageProps} />
      </motion.div>
    </ConfettiProvider>
  );
}
