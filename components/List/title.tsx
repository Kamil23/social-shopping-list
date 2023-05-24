import { useRouter } from "next/router"

export default function ListTitle({ updatedAt }: { updatedAt: string }) {
  const router = useRouter()
  return (
    <div className="flex flex-col mb-8">
      <div>{`Lista zakupowa: ${router.query.sessionId}`}</div>
      <div className="text-xs">{`Ostatni update: ${updatedAt || "Brak"}`}</div>
    </div>
  )
}