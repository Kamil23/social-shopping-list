import { useRouter } from "next/router";
import Button from "../Button";
import { useState } from "react";

export default function ListHeader({ updatedAt }: { updatedAt: string }) {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
  };
  const date = new Date(updatedAt);
  return (
    <div className="w-full flex flex-col space-y-1 mb-4 p-4 fixed top-0 bg-white">
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">{`Lista zakupowa: ${router.query.sessionId}`}</div>
      <div className="flex space-x-2 items-center">
        <div className="text-xs">{`Ostatnia zmiana: ${date.toLocaleDateString()} ${
          date.toLocaleTimeString() || "Brak"
        }`}</div>
        <Button
          title={`${isCopied ? "Skopiowano!" : "Kopiuj link"}`}
          handler={handleCopyLink}
        />
      </div>
    </div>
  );
}
