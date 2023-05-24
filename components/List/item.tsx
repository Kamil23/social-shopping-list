export default function ListItem({ name, createdAt }: { name: string, createdAt: string }) {
  return (
    <div className="flex space-x-2 items-baseline">
      <input type="checkbox" />
      <div>{name}</div>
      <div className="text-[10px]">{createdAt}</div>
    </div>
  )
}