import Link from "next/link"
import { ReactNode, useEffect } from "react"
import useAuth from "../../utils/useAuth"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { Socket, io } from 'socket.io-client'

type Props = {
    children: ReactNode
}

export const socket: Socket = io.connect(process.env.NEXT_PUBLIC_BASE_URL);

export default ({ children }: Props) => {
    const { verifyAuth, user } = useAuth()

    const meeting = useSelector((state: RootState) => state.meeting)


    useEffect(() => {
        //Check auth user
        verifyAuth()
    }, [])

    return (
        <div className="bg-gray-100 font-sans w-screen h-screen m-0 overflow-hidden">
            {!meeting.meeting &&
                <div className="bg-white shadow">
                    <div className="container mx-auto px-4 sm:px-20">
                        <div className="flex items-center justify-between py-4">
                            <div className="mx-auto sm:mx-0">
                                <Link href='/'>
                                    <img
                                        src="/assets/brand.png"
                                    />
                                </Link>
                            </div>


                            {user ?
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-end">
                                        <span className="text-gray-600 text-sm font-semibold">{user.name}</span>
                                        <span className="text-gray-600 text-sm -mt-1">{user.email}</span>
                                    </div>

                                    <div>
                                        <div className="relative inline-flex items-center justify-center w-9 h-9 overflow-hidden bg-indigo-700 rounded-full ">
                                            <span className="font-medium text-gray-600 dark:text-gray-300">{user.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="hidden sm:flex sm:items-center">
                                    <Link href="/auth/signin" className="text-gray-800 text-sm font-semibold hover:text-blue-500 mr-5">Entrar</Link>
                                    <Link href="/auth/signup" className="text-sm font-semibold border px-4 py-1.5 rounded-lg border-blue-600 text-gray-800 hover:bg-blue-500 hover:text-white hover:border-blue-600 ">Criar conta</Link>
                                </div>
                            }
                        </div>

                        <div className="block sm:hidden bg-white border-t-2 py-2">
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center pt-2">
                                    <a href="#" className="text-gray-800 text-sm font-semibold hover:text-blue-600 mr-4">Entrar</a>
                                    <a href="#" className="text-gray-800 text-sm font-semibold border px-4 py-1 rounded-lg hover:text-blue-600 hover:border-blue-600">Criar conta</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }


            <main className={`${!meeting.meeting ? 'h-[calc(100vh-82px)]' : 'h-full'} overflow-auto`}>
                {children}
            </main>
        </div>
    )
}