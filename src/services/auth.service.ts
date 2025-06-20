import * as jwt_decode from 'jwt-decode';

export class AuthService {
    static get token () {
        return localStorage.getItem('token');
    }

    static get user () {
        if (!AuthService.token) {
            return
        }
        return jwt_decode.jwtDecode<{username: string, isAdmin: boolean}>(AuthService.token);
    }

    static setToken (token: string) {
        return localStorage.setItem('token', token);
    }

    static resetToken() {
        localStorage.clear()
    }
}