import {createContext, type FC, type PropsWithChildren, useEffect, useState} from "react";
import {AuthService} from "../services/auth.service.ts";
import type {TUser} from "../types.ts";

type TAuthProvider = {
    user?: TUser
    setUser: (user: TUser | undefined) => void
}

export const AuthContext = createContext<TAuthProvider>({
    setUser: () => {}
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<TUser>();

    useEffect(() => {
        setUser(AuthService.user)
    }, [])

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
};