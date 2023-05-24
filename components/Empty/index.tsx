import { APIUrl } from "@/enum";
import { useRouter } from "next/router";

export default function Empty() {
  const router = useRouter();
  const createSession = async () => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(APIUrl.CreateSession, options);
      const {
        data: { sessionId },
      } = await response.json();
      router.push(sessionId);
    } catch (error) {}
  };
  return (
    <div className="flex flex-col space-y-2 justify-center items-center">
      <div>Podana lista nie istnieje</div>
      <a
        onClick={createSession}
        className="group relative inline-block focus:outline-none focus:ring w-fit"
      >
        <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>

        <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75">
          Stwórz nową
        </span>
      </a>
    </div>
  );
}
