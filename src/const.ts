import {ERoundStatus} from "./types.ts";

export const TIME_FORMAT = 'DD.MM.YYYY, HH:mm:ss'

export const ROUND_STATUS_COLOR_CLASS = {
    [ERoundStatus.coolDown]: 'bg-amber-300',
    [ERoundStatus.active]: 'bg-green-600',
    [ERoundStatus.finished]: 'bg-red-600',
    [ERoundStatus.unknown]: '',
}


export const ROUND_STATUS_NAME = {
    [ERoundStatus.coolDown]: 'Cooldown',
    [ERoundStatus.active]: 'Активен',
    [ERoundStatus.finished]: 'Завершен',
    [ERoundStatus.unknown]: '',
}