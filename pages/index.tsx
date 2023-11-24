import AppVersion from "@/components/AppVersion";
import Button from "@/components/Button";
import { createSession } from "@/requests";
import Image from "next/image";
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
    <div>
      <main className="flex h-auto mx-5 my-10 py-10 justify-center items-center space-y-10 flex-col border border-[#E4F2FF] rounded-2xl font-anek-latin">
        {/** icon */}
        <div className="bg-light-blue rounded-full flex justify-center items-center w-[240px] h-[240px]">
          <div className="relative">
            <Image
              src="/icons/list.svg"
              alt="doc icon"
              className="w-32 h-36"
              width={128}
              height={153}
            />
            <div className="absolute -bottom-[24px] -right-[24px] rounded-full bg-light-blue p-2">
              <div className="bg-primary-blue rounded-full p-6">
                <Image
                  src="/icons/plus.svg"
                  alt="plus icon"
                  className="w-4 h-4"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          </div>
        </div>

        {/** title */}
        <div className="px-10 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-dark-blue text-3xl mb-5">Cześć!</h1>
          <h2 className="text-xl text-[#000F1D] text-center mb-10">
            Na ten moment nie jesteś członkiem żadnej listy.
          </h2>
          <p className="text-lg text-[#000F1D] text-center font-light">
            Stwórz swoją pierwszą listę lub podaj link do listy znajomego.
          </p>
        </div>
        <div className="space-y-4">
          <Button
            title="Stwórz pierwszą listę"
            handler={handleCreateSession}
            isLoading={isLoading}
            bgStyle="bg-primary-blue"
            textStyle="text-white-on-blue"
            icon={
              <Image
                src="/icons/plus.svg"
                alt="plus icon"
                className="w-3 h-3"
                width={12}
                height={12}
              />
            }
          />
          <Button
            title="Podaj link do listy znajomego"
            handler={handleCreateSession}
            bgStyle="bg-light-blue"
            textStyle="text-medium-blue"
            icon={
              <Image
                src="/icons/link.svg"
                alt="link icon"
                className="w-4 h-4"
                width={16}
                height={16}
              />
            }
          />
        </div>
      </main>
      <aside className="mb-1 mr-1 text-right">
        <AppVersion />
      </aside>
    </div>
  );
}
