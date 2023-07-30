import Link from "next/link"
import { useEffect, useState } from "react"
import useAuth from "../../utils/useAuth"
import { useToast } from '@chakra-ui/react'
import { useRouter } from "next/router"

export default () => {
    const { signup } = useAuth()

    const toast = useToast()
    const router = useRouter()

    const [inputName, setInputName] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')

    const handleSignup = async () => {
        if (!inputName || !inputPassword) {
            toast({
                title: 'Preencha todos os campos',
                position: 'bottom-left',
                status: 'error'
            })

            return;
        }

        if (!inputEmail.toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            toast({
                title: 'Este email é inválido',
                position: 'bottom-left',
                status: 'error'
            })

            return;
        }

        const requestSignup = await signup(inputName, inputEmail, inputPassword)
        if (requestSignup) {
            toast({
                title: requestSignup,
                position: 'bottom-left',
                status: 'error'
            })
        } else {
            toast({
                title: "Sucesso ao criar conta!",
                position: 'bottom-left',
                status: 'success'
            })

            router.push('/')
        }
    }




    return (
        <div className="flex h-full flex-col justify-center items-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Criar uma conta gratuita
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Nome
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none px-2 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                value={inputName}
                                onChange={e => setInputName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none px-2 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                value={inputEmail}
                                onChange={e => setInputEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Senha
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                type="text"
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset outline-none px-2 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                value={inputPassword}
                                onChange={e => setInputPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleSignup}
                            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            Criar conta
                        </button>
                    </div>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Já tem conta? {' '}
                    <Link href="/auth/signin" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    )
}
