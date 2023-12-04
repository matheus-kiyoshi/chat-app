'use client'

import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { useChatPage } from "./ChatList";

type Data = {
  data: string
}

type Message = {
  data: Data
  from: string
}

type User = {
  [key: string]: string
}

type Users = {
  users: string[]
  setUsers: (user: string[]) => void
}

export const useOnline = create<Users>((set) => ({
  users: [],
  setUsers: (user: string[]) => {
    set(() => ({ users: user }))
  }
}))

export default function Chat({ name }: { name: string }) {
  const [socket, setSocket] = useState<Socket<any>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { setUsers, users } = useOnline();
  const { inc, current, setCurrent, chats } = useChatPage();

  useEffect(() => {
    const newSocket = io('http://localhost:3000');

    newSocket.on('connect', () => {
      newSocket.emit('setUsername', { username: name });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [name]);

  useEffect(() => {
    socket?.on('userList', (users: User): void => {
      const susers = Object.values(users).map(user => user);
      setUsers(susers);
    })
  }, [socket, setUsers]);

  useEffect(() => {
    console.log(current)
    if (current === "#-CHAT-GERAL") {
      socket?.on('message-global', (message: Message): void => {
        setMessages((prevState) => {
          return [...prevState, message];
        })
      });
    } else {
      socket?.on('message-private', (message: Message): void => {
        setMessages((prevState) => {
          return [...prevState, message];
        })
      });
    }
  }, [socket, current]);

  useEffect(() => {
    setMessages([]);
  }, [current]);

  const handleMessage = () => {
    if (inputValue !== '') {
      if (current === "#-CHAT-GERAL") {
        socket?.emit('message', { data: inputValue });
      } else {
        const usersValues = users.map(user => Object.values(user))
        const usersKeys = users.map(user => Object.keys(user))
        const userIndex = usersValues.findIndex(user => user.includes(current));
        const userReceiver = usersKeys.flat()[userIndex];
        socket?.emit('privateMessage', { data: { to: userReceiver, message: inputValue } });
      }
    } else {
      return;
    }
  }

  const startPrivateChat = (username: string) => {
    if (chats.includes(username)) {
      setCurrent(username);
      setMessages([]);
    } else if (username !== name) {
      setCurrent(username);
      inc(username);
      setMessages([]);
    }
  }

  return (
    <section className="flex flex-col justify-between items-center gap-6 w-2/4 h-full bg-gray-800">
      <h1 className="text-3xl font-semibold bg-gray-600 w-full h-auto p-6">{current}</h1>
      <div className="flex flex-col gap-2 w-full h-full overflow-y-scroll p-2 scroll-smooth">
        {messages.map((message, index) => (
          <div key={index} className={`w-full flex ${message.from === name ? 'text-right justify-end' : 'text-left justify-start'}`}>
            <p className="bg-gray-700 w-auto p-3 rounded-lg flex flex-col gap-1 ">
              <span className={`font-semibold text-lg ${message.from !== name && 'cursor-pointer'}`} onClick={() => startPrivateChat(message.from)}>{message.from}</span>
              <span className="text-sm font-medium">{message.data.data}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="flex w-full gap-2 h-auto p-6">
        <input 
          type="text" 
          placeholder="Envie uma mensagem..." 
          className="border rounded-md bg-gray-600 p-2 text-lg font-semibold w-full" 
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMessage();
            }
          }}
        />
        <button className="bg-blue-500 py-2 px-3.5 rounded-md text-lg font-semibold hover:bg-blue-600" onClick={handleMessage}>
          <IoSend />
        </button>
      </div>
    </section>
  )
}