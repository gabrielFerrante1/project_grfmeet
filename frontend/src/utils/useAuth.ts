import { useDispatch } from "react-redux"
import { ApiSigninUser, ApiSignupUser, ApiVerifyAuthUser } from "../types/Auth"
import { api } from "./api"
import { setAuthUser } from "../redux/reducers/authReducer"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"

export default () => {
    const auth = useSelector((state: RootState) => state.auth)

    const dispatch = useDispatch()

    return {
        verifyAuth: async () => {
            const jwt = localStorage.getItem('gmeet_jwt');

            if (jwt) {
                const request = await api<ApiVerifyAuthUser>('auth/verify', 'get', {}, jwt)

                if (!request.data.error) {
                    dispatch(setAuthUser({
                        id: request.data.user.id,
                        email: request.data.user.email,
                        name: request.data.user.name,
                        token: jwt
                    }))
                }
            }
        },
        signup: async (name: string, email: string, password: string) => {
            const request = await api<ApiSignupUser>('auth/register', 'post', { name, email, password })

            if (!request.data.error) {
                dispatch(setAuthUser({
                    id: request.data.user.id,
                    email: request.data.user.email,
                    name: request.data.user.name,
                    token: request.data.user.token
                }))

                localStorage.setItem('gmeet_jwt', request.data.user.token)
            }

            return request.data.error
        },
        signin: async (email: string, password: string) => {
            const request  = await api<ApiSigninUser>('auth/login', 'post', { email, password })

            if (!request.data.error) {
                dispatch(setAuthUser({
                    id: request.data.user.id,
                    email: request.data.user.email,
                    name: request.data.user.name,
                    token: request.data.user.token
                }))

                localStorage.setItem('gmeet_jwt', request.data.user.token)
            }

            return request.data.error
        },
        user: auth.user
    }
}