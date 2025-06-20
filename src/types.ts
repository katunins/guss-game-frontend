export type TLoginFormData = {username: string, password: string}

export type TUserResponse = { username: string, token: string, isAdmin: boolean }
export type TUser = Omit<TUserResponse, 'token'>

export type TRound = { uuid: string, createdAt: string, startAt: string, finishAt: string, taps: TTap[] }

export type TTap = { id: number, count: number, user: TUser }

export enum ERoundStatus {
    coolDown = 'coolDown',
    active = 'active',
    finished = 'finished',
    unknown = 'unknown'
}