'use client'

import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { Socket, io } from "socket.io-client";
import { create } from "zustand";

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
  const { setUsers } = useOnline();

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
    socket?.on('message', (message: Message): void => {
      setMessages((prevState) => {
        return [...prevState, message];
      })
    });
  }, [socket]);

  const handleMessage = () => {
    if (inputValue !== '') {
      socket?.emit('message', { data: inputValue });
      setInputValue('');
    } else {
      return;
    }
  }

  return (
    <section className="flex flex-col justify-between items-center gap-6 w-2/4 h-full bg-gray-800">
      <h1 className="text-3xl font-semibold bg-gray-600 w-full h-auto p-6">Chat Geral</h1>
      <div className="flex flex-col gap-2 w-full h-full overflow-y-scroll p-2">
        {messages.map((message, index) => (
          <div key={index}>
            <p className="text-lg font-semibold">{message.from}: {message.data.data}</p>
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