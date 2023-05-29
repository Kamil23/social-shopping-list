import { useRouter } from "next/router";
import Button from "../Button";
import { createSession } from "@/requests";
import { useState } from "react";

export default function Empty() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateSession = async () => {
    setIsLoading(true);
    const sessionId = await createSession();
    router.push(sessionId);
  };

  return (
    <div className="flex flex-col space-y-2 justify-center items-center">
      <div>Podana lista nie istnieje</div>
      <Button title="Stwórz nową" handler={handleCreateSession} isLoading={isLoading} />
    </div>
  );
}
