'use client'

import { useOnline } from "./Chat";

export default function UsersOnline() {
  const { users } = useOnline();

  return (
    <aside className="flex flex-col w-1/4 h-full bg-gray-800 p-4">
      <h1 className="text-3xl font-semibold">Usuários Online</h1>
      {users && (
        <ul className="flex flex-col gap-2">
          {users.map((user, index) => (
            <li key={index} className="text-lg font-semibold">
              {Object.keys(user).map((key, innerIndex) => (
                <p key={innerIndex}>
                  {user[key as any]}
                  <span className="text-green-400">• Online</span>
                </p>
              ))}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
