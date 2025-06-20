import {type FormEventHandler, useContext, useState} from "react";
import {ApiService} from "../services/api.service.ts";
import {useNavigate} from "react-router-dom";
import {AuthService} from "../services/auth.service.ts";
import {AuthContext} from "../providers/auth.provider.tsx";
import type {TLoginFormData} from "../types.ts";

export const Login = () => {

    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const {setUser} = useContext(AuthContext)

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const params: TLoginFormData = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
        }
        if (!params?.username || !params?.password) {
            setIsError(true)
            return
        }
        setIsLoading(true)
        ApiService.getUser(params).then(result => {
            if (result?.token) {
                AuthService.setToken(result.token)
                const {token, ...user} = result
                setUser(user)
                navigate('/')
            } else {
                setIsError(true)
                setUser(undefined)
                setIsLoading(false)
                return
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username" name="username" type="text" placeholder="Username"/>
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${isError && "border-red-500 "}`}
                    id="password" name="password" type="password" placeholder="******************"/>
                {isError && <p className="text-red-500 text-xs italic">Incorrect username or password.</p>}
            </div>
            <div className="flex items-center justify-between">
                <button
                    disabled={isLoading}
                    className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? "bg-gray-500 hover:bg-gray-700 ":"bg-blue-500 hover:bg-blue-700 "}`}>
                    Sign In
                </button>
            </div>
        </form>
    )
}