import { IoSend } from "react-icons/io5";

export default function Join({ handleSubmit }: { handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="flex flex-col gap-3 items-center justify-center">
      <h1 className="text-3xl font-semibold">Entrar</h1>
      <p className="text-lg font-thin">Digite um nome de usuário para se conectar</p>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome de usuário" name="username" id="username" className="border rounded-md bg-gray-600 p-2 text-lg font-semibold" required />
        <button type="submit" className="bg-blue-500 py-2 px-3.5 rounded-md text-lg font-semibold hover:bg-blue-600">
          <IoSend />
        </button>
      </form>
    </section>    
  )
}