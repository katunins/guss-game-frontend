import {type FC, useCallback, useContext} from "react";
import {AuthContext} from "../providers/auth.provider.tsx";
import {AuthService} from "../services/auth.service.ts";

export const Header: FC = () => {
    const {user, setUser} = useContext(AuthContext)

    const handleLogOut = useCallback(() => {
        AuthService.resetToken()
        setUser(undefined)
        window.location.replace('/login')
    }, [])

    return (
        <header className="flex justify-end container py-8">
            {!!user && (
                <div className="flex gap-2">
                    <b>{user.username}</b>
                    <button
                        onClick={handleLogOut}
                        className="hover:text-blue-500">
                        Выйти из аккаунта
                    </button>
                </div>
            )}
        </header>
    )
}