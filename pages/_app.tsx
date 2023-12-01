import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { motion } from "framer-motion";
import { ConfettiProvider } from "@/hooks/useConfetti";
import Script from "next/script";

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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `}
      </Script>
    </ConfettiProvider>
  );
}
