import ChatList from "./ChatList";

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-1/4 h-full bg-gray-700 p-4">
      <h1 className="text-3xl font-semibold">Conversas</h1>
      <ChatList />
    </aside>
  )
}