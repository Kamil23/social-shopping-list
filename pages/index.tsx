import AppVersion from "@/components/AppVersion";
import Button from "@/components/Button";
import { createSession } from "@/requests";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [favoritesList, setFavoritesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleCreateSession = async () => {
    setIsLoading(true);
    const sessionId = await createSession();
    router.push(sessionId);
  };

  useEffect(() => {
    if (!window) {
      return;
    }
    const favoritesList = window.localStorage.getItem("favoritesList");
    if (!favoritesList) {
      return;
    }
    setFavoritesList(JSON.parse(window.localStorage.getItem("favoritesList")));
  }, []);

  return (
    <main className="relative">
      {favoritesList.length > 0 ? (
        <FavoritesList
          favoritesList={favoritesList}
          handleCreateSession={handleCreateSession}
          isLoading={isLoading}
        />
      ) : (
        <EmptyList
          handleCreateSession={handleCreateSession}
          isLoading={isLoading}
        />
      )}
    </main>
  );
}

const FavoritesList = ({ favoritesList, handleCreateSession, isLoading }) => {
  const router = useRouter();
  const [updatedFavoritesList, setUpdatedFavoritesList] = useState([]);

  useEffect(() => {
    setUpdatedFavoritesList(favoritesList);
  }, [favoritesList]);

  return (
    <div className="flex flex-col">
      {/* * header
      <h1 className="flex-1 text-center px-2 py-4 font-anek-latin text-base text-dark-blue border-b border-[#E3EAF0]">
        Twoje listy
      </h1> */}

      {/** list */}
      <div className="flex-1 m-5 flex flex-col space-y-3 overflow-y-auto mb-[225px]">
        {updatedFavoritesList.map((list) => (
          <ListElement key={1} list={list} setUpdatedFavoritesList={setUpdatedFavoritesList} />
        ))}
      </div>

      {/** bottom bar */}
      <div className="flex-1 w-full items-center fixed bottom-0 flex flex-col space-y-2 px-4 py-5 bg-[#EFF7FF] border-t border-[#E4F2FF]">
        <Button
          title="Stwórz nową listę"
          handler={handleCreateSession}
          isLoading={isLoading}
          bgStyle="bg-primary-blue"
          textStyle="text-white-on-blue"
          icon={
            <Image
              src="/icons/plus.svg"
              alt="plus icon"
              className="w-2 h-2"
              width={8}
              height={8}
            />
          }
          additionalStyle={{ padding: "12px", fontSize: "12px" }}
        />
        <Button
          title="Podaj link do listy znajomego"
          handler={() => router.push("join-list")}
          bgStyle="bg-white"
          textStyle="text-primary-blue"
          icon={
            <Image
              src="/icons/link.svg"
              alt="link icon"
              className="w-3 h-3"
              width={12}
              height={12}
            />
          }
          additionalStyle={{
            padding: "12px",
            fontSize: "12px",
            border: "1px solid #E4F2FF",
          }}
        />
      </div>
    </div>
  );
};

const ListElement = ({ list, setUpdatedFavoritesList }) => {
  const router = useRouter();
  const { name, updatedAt, id } = list;
  const date = new Date(updatedAt);

  const handleDeleteList = (e) => {
    e.stopPropagation();
    const parsedFavoritesList = JSON.parse(
      window.localStorage.getItem("favoritesList")
    );
    const updatedFavoritesList = parsedFavoritesList.filter(
      (list) => list.id !== id
    );
    window.localStorage.setItem(
      "favoritesList",
      JSON.stringify(updatedFavoritesList)
    );
    setUpdatedFavoritesList(updatedFavoritesList);
    if (updatedFavoritesList.length === 0) {
      router.reload();
    }
  };
  return (
    <button
      className="px-3 py-4 flex rounded-lg bg-[#EFF7FF] space-x-4 justify-between items-center"
      onClick={() => router.push(id)}
    >
      <Image
        src="/icons/document.svg"
        alt="ikona dokumentu"
        width={22}
        height={30}
      />
      <div className="flex flex-col items-start">
        <span className="font-anek-latin text-base text-[#3D3D3E]">{name}</span>
        <span className="font-anek-latin text-xs text-[#909FAC]">{`Edytowana: ${date
          .toLocaleDateString()
          .replaceAll("/", ".")} ${date.toLocaleTimeString()}`}</span>
      </div>
      <button className="p-2 flex justify-center items-center" onClick={(e) => handleDeleteList(e)}>
        <Image
          src="/icons/close.svg"
          alt="ikona usunięcia listy"
          width={12}
          height={12}
          className="w-3 h-3"
        />
      </button>
    </button>
  );
};

const EmptyList = ({ handleCreateSession, isLoading }) => {
  const router = useRouter();
  return (
    <div className="flex min-h-[100vh] h-auto mx-5 my-10 py-10 justify-center items-center space-y-10 flex-col border border-[#E4F2FF] rounded-2xl font-anek-latin">
      {/** icon */}
      <div className="bg-light-blue rounded-full flex justify-center items-center w-[180px] h-[180px]">
        <div className="relative">
          <Image
            src="/icons/list.svg"
            alt="doc icon"
            className="w-24 h-28"
            width={96}
            height={112}
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
        <h1 className="font-semibold text-dark-blue text-2xl mb-5">Cześć!</h1>
        <h2 className="text-base text-[#000F1D] text-center mb-10">
          Na ten moment nie jesteś członkiem żadnej listy.
        </h2>
        <p className="text-sm text-[#000F1D] text-center font-light">
          Stwórz swoją pierwszą listę lub podaj link do listy znajomego.
        </p>
      </div>
      <div className="space-y-2">
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
              className="w-2 h-2"
              width={8}
              height={8}
            />
          }
        />
        <Button
          title="Podaj link"
          handler={() => router.push("join-list")}
          bgStyle="bg-light-blue"
          textStyle="text-medium-blue"
          icon={
            <Image
              src="/icons/link.svg"
              alt="link icon"
              className="w-3 h-3"
              width={12}
              height={12}
            />
          }
        />
      </div>
      <aside className="mb-1 mr-1 text-right">
        <AppVersion />
      </aside>
    </div>
  );
};
