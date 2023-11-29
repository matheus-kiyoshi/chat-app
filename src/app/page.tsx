'use client'

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Join from "./components/join/Join";
import { useState } from "react";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/chat/Sidebar";
import UsersOnline from "./components/chat/UsersOnline";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get('username') as string;
  
    setName(inputValue);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-gray-800 text-white">
      {loading ? <AiOutlineLoading3Quarters className="animate-spin text-5xl" /> 
      : (
        name ? (
          <div className="flex gap-0 w-full h-full">
            <Sidebar />
            <Chat name={name} /> 
            <UsersOnline />
          </div>
        ) : <Join handleSubmit={handleSubmit} />
      )}
    </main>    
  )
}
