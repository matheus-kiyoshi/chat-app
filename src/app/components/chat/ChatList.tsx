import { create } from "zustand"

type IChatPage = {
  current: string
  setCurrent: (current: string) => void
  chats: string[]
  inc: (chatToAdd: string) => void
}

export const useChatPage = create<IChatPage>((set) => ({
  current: '#-CHAT-GERAL',
  setCurrent: (current: string) => {
    set({ current })
  },
  chats: ['#-CHAT-GERAL'],
  inc: (chatToAdd: string) => {
    set((state: IChatPage) => ({
      chats: [...state.chats, chatToAdd]
    }))
  }
}))

export default function ChatList() {
  const { current, chats, setCurrent } = useChatPage()
  
  return (
    <div className="flex flex-col gap-2 mt-3">
      {chats.map((chat, index) => (
        <div
          key={index}
          className={`text-lg font-semibold cursor-pointer ${current === chat ? 'text-blue-500' : ''}`}
          onClick={() => setCurrent(chat)}
        >
          {chat}
        </div>
      ))}
    </div>
  )
}