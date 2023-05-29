import Button from "@/components/Button";
import { createSession } from "@/requests";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateSession = async () => {
    setIsLoading(true);
    const sessionId = await createSession();
    router.push(sessionId);
  };
  return (
    <main className="w-full h-[100vh] flex justify-center items-center">
      <Button title="Stwórz nową listę" handler={handleCreateSession} isLoading={isLoading} />
    </main>
  )
}
