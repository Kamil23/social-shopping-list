import { useRouter } from "next/router";
import Button from "../Button";

export default function ListTitle({ updatedAt, connectionCount }: { updatedAt: string, connectionCount?: number }) {
  const router = useRouter();
  const handleShare = () => {
    try {
      navigator.share({
        title: "Lista zakupów",
        url: window.location.href,
      });
    } catch (e) {
      console.error(e);
    }
  };
  const date = new Date(updatedAt);
  return (
    <div className="flex flex-col space-y-1 mb-4 p-4">
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">{`Lista: ${router.query.sessionId}`}</div>
      <div className="flex space-x-2 items-center">
        <div className="text-xs flex-1">{`Ostatnia zmiana: ${date.toLocaleDateString()} ${
          date.toLocaleTimeString() || "Brak"
        }`}</div>
        <Button
          title="Udostępnij"
          handler={handleShare}
        />
      </div>
      <div className="flex">{
        connectionCount > 0 ? (
          <div className="flex items-center space-x-1">
          <div className="text-xs flex flex-1">Liczba osób online</div>
          {
            Array.from(Array(connectionCount)).map((_, index) => (
              <div key={index} className="w-2 h-2 bg-green-500 rounded-full animate-smoothShow"></div>
            ))
          }
          </div>
        ) : null
      }</div>
    </div>
  );
}
