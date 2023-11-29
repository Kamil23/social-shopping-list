import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../Button";
import Image from "next/image";
import ListTitle from "./title";
import ContextMenu from "./contextMenu";
import { generateSingularOrPlural } from "@/helpers";
import { SessionData } from "@/types/sessionList";

export default function ListHeader({
  updatedAt,
  connectionCount,
  listName,
  setListName,
  sessionData,
}: {
  updatedAt: string;
  connectionCount?: number;
  listName: string;
  setListName: (name: string) => void;
  sessionData: SessionData;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleShare = () => {
    try {
      navigator.share({
        title: `${listName}`,
        url: window.location.href,
      });
    } catch (e) {
      console.error(e);
    }
  };
  const date = new Date(updatedAt);
  return (
    <div className="flex flex-col space-y-5 mb-4 p-5">
      {/* header bar */}
      <div className="flex justify-between items-center">
        {!isEditing ? (
          <button className="p-5" onClick={() => router.push("/")}>
            <Image
              src="/icons/arrow.svg"
              alt="przycisk wstecz"
              width={18}
              height={10}
            />
          </button>
        ) : null}

        <ListTitle
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          name={listName}
          setListName={setListName}
        />
        {!isEditing ? (
          <ContextMenu setIsEditing={setIsEditing} handleShare={handleShare} sessionData={sessionData} />
        ) : null}
      </div>
      {/* header description */}
      <div className="flex space-x-5">
        <div className="flex flex-col justify-center space-y-1 flex-2">
          <div className="flex space-x-2 items-center">
            <span className="text-[#000F1D] text-sm">Teraz online:</span>
            <span className="text-[#909FAC] text-sm">{`${connectionCount} ${generateSingularOrPlural(
              connectionCount
            )}`}</span>
          </div>
          <div className="flex space-x-2 items-center">
            <span className="text-[#000F1D] text-sm">Zmiany:</span>
            <span className="text-[#909FAC] text-sm">{`${date
              .toLocaleDateString()
              .replaceAll("/", ".")} ${date.toLocaleTimeString()}`}</span>
          </div>
        </div>
        <div className="flex-1">
          <button
            onClick={handleShare}
            className={`w-full flex justify-center items-center space-x-2 focus:outline-none cursor-pointer transition ease-in-out delay-150 px-2 py-[18px] rounded-lg bg-[#E4F2FF]`}
          >
            <Image
              src="/icons/link.svg"
              alt="link icon"
              className="w-4 h-4"
              width={16}
              height={16}
            />
            <span className={`font-medium text-medium-blue`}>Udostępnij</span>
          </button>
        </div>
      </div>
    </div>
  );
}
