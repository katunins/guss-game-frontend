import {AuthService} from "./auth.service.ts";
import type {TLoginFormData, TRound, TTap, TUserResponse} from "../types.ts";

export class ApiService {

    static async _fetch(url: string, params?: { method?: 'POST' | 'DELETE' }) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${url}`,
                {
                    headers: {'authorization': `Bearer ${AuthService.token}`},
                    ...params || {}
                }
            )
            if (!response.ok && response.status === 401) {
                window.location.replace('/login');
                return
            }
            return response.json()
        } catch (e) {
            console.error(e)
        }
    }

    static async getUser(formData: TLoginFormData): Promise<TUserResponse | undefined> {
        try {
            const params = new URLSearchParams(formData).toString();
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users?${params}`)
            return response.json()
        } catch (e) {
        }
    }

    static async getRounds(): Promise<TRound[] | undefined> {
        return ApiService._fetch('rounds')
    }

    static async getRound(uuid: string):Promise<TRound | undefined> {
        return ApiService._fetch(`rounds/${uuid}`)
    }

    static async getTap(uuid: string):Promise<TTap | undefined> {
        return ApiService._fetch(`taps/${uuid}`)
    }

    static async createRound(): Promise<TRound | undefined> {
        return ApiService._fetch('rounds', {method: 'POST'})
    }

    static async deleteRound(uuid: string) {
        return ApiService._fetch(`rounds/${uuid}`, {method: 'DELETE'})
    }
}