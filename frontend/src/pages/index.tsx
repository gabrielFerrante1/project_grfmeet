import { useEffect, useState } from "react"
import { api } from "../utils/api"
import { useRouter } from "next/router"
import useAuth from "../utils/useAuth"
import { ApiCreateMeeting } from "../types/Meeting"

export default () => {
    const router = useRouter()

    const { user } = useAuth()

    const [inputCode, setInputCode] = useState('')

    const handleNewMeeting = async () => {
        const newMeeting = await api<ApiCreateMeeting>('meetings', 'post', {}, user?.token)

        router.push(`/${newMeeting.data.meeting.code}`)
    }

    const handleJoinMeeting = () => router.push(`/${inputCode}`)

    return (
        <div>
            <div className="  isolate px-6 pt-14 lg:px-8">

                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">

                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Videochamadas premium. <br /> Agora gratuitas para todos.</h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Reformulamos o Grf Meet, nosso serviço seguro para reuniões de todos os tipos. Agora o Grf Meet Premium é aberto e gratuito para todos.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-7">
                            <button
                                onClick={() => user ? handleNewMeeting() : router.push('/auth/signup')}
                                className="flex items-center gap-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                                Nova reunião
                            </button>

                            <div className="flex items-center gap-2">
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full rounded-md border py-2 pl-10 pr-20 text-gray-900 outline-none  transition focus:border-blue-500 "
                                        placeholder="Digite um código"
                                        value={inputCode}
                                        onChange={e => setInputCode(e.target.value)}
                                    />
                                </div>

                                {inputCode && <button onClick={handleJoinMeeting} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-full outline-none   text-sm px-5 py-2 text-center mr-2   ">Participar</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}