import Button from "@/components/Button";
import { createSession } from "@/requests";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const handleCreateSession = async () => {
    const sessionId = await createSession();
    router.push(sessionId);
  };
  return (
    <main className="w-full h-[100vh] flex justify-center items-center">
      <Button title="Stwórz nową listę" handler={handleCreateSession} />
    </main>
  )
}
