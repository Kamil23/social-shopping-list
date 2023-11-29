import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import AppVersion from "@/components/AppVersion";
import { createSession } from "@/requests";
import { motion } from "framer-motion";

export default function JoinList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isListFound, setIsListFound] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCorrectUrl, setIsCorrectUrl] = useState(false);

  const handleSearchSession = async () => {
    setIsLoading(true);
    const sessionId = await createSession();
    router.push(sessionId);
  };

  useEffect(() => {
    // sample url: http://localhost:3000/8e3ed065-eb6c-40e4-8497-c51dd5e0b221
    // UUID generated from crypto.randomUUID() in createSession.ts
    const regex = new RegExp(
      "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
    );
    const isUrlHasCorrectUuid = regex.test(inputValue);
    if (isUrlHasCorrectUuid) {
      setIsCorrectUrl(true);
    } else {
      setIsCorrectUrl(false);
    }
  }, [inputValue]);

  // CHECK IF LIST EXISTS TO CONSIDER
  // useEffect(() => {
  //   if (isCorrectUrl) {
  //     // http://localhost:3000/8e3ed065-eb6c-40e4-8497-c51dd5e0b221
  //     const sessionId = inputValue.split("/")[3];
  //     const checkIfSessionExists = async () => {
  //       const response = await fetch(`/api/session/${sessionId}`);
  //       const body = await response.text();
  //       const { exists } = await response.json();
  //       if (exists) {
  //         setIsListFound(true);
  //       } else {
  //         setIsListFound(false);
  //       }
  //     };
  //     checkIfSessionExists();
  //   }
  // }, [isCorrectUrl, inputValue]);

  return (
    <div>
      <main className="flex min-h-[100vh] h-auto mx-5 my-10 py-10 justify-around items-center space-y-10 flex-col border border-[#E4F2FF] rounded-2xl font-anek-latin">
        {/** title */}
        <div className="px-10 w-full flex flex-col justify-center items-center space-y-16">
          <h1 className="font-semibold text-dark-blue text-3xl mb-5 text-center">
            Dodaj listę znajomego
          </h1>
          <div className="flex items-center w-full">
            <input
              placeholder="Wklej link do listy..."
              value={inputValue}
              onChange={(e) => {
                e.preventDefault();
                setInputValue(e.target.value);
              }}
              className={`w-full text-medium-blue placeholder-medium-blue font-anek-latin font-light px-4 py-6 bg-light-blue ${
                isCorrectUrl ? "rounded-l-lg" : "rounded-lg"
              }  outline-none`}
            />
            {isCorrectUrl ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="flex justify-center items-center bg-primary-blue rounded-r-lg w-[72px] h-[72px]"
                onClick={() => {
                  router.push(inputValue.split("/")[3]);
                }}
              >
                <Image
                  src="/icons/check.svg"
                  alt="ikona check akceptująca link"
                  width={16}
                  height={11}
                />
              </motion.button>
            ) : null}
          </div>
        </div>
        <button
          className="flex justify-center items-center space-x-1"
          onClick={() => router.push("/")}
        >
          <Image
            src="/icons/arrow-back-join.svg"
            alt="ikona wstecz"
            width={12}
            height={8}
          />
          <span className="font-medium text-medium-blue">
            Wróć do widoku głównego
          </span>
        </button>
      </main>
      <aside className="mb-1 mr-1 text-right">
        <AppVersion />
      </aside>
    </div>
  );
}
