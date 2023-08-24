import { useRouter } from "next/router";
import Button from "../Button";
import { useState } from "react";

export default function ListTitle({ updatedAt }: { updatedAt: string }) {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
  };
  const date = new Date(updatedAt);
  return (
    <div className="flex flex-col space-y-1 mb-4 p-4">
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">{`Lista zakupowa: ${router.query.sessionId}`}</div>
      <div className="flex space-x-2 items-center">
        <div className="text-xs flex-1">{`Ostatnia zmiana: ${date.toLocaleDateString()} ${
          date.toLocaleTimeString() || "Brak"
        }`}</div>
        <Button
          title={`${isCopied ? "Link został skopiowany!" : "Kopiuj link"}`}
          handler={handleCopyLink}
        />
      </div>
    </div>
  );
}
