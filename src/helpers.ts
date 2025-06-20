import {ERoundStatus, type TRound} from "./types.ts";
import dayjs from "dayjs";

export const convertRoundDate = (round: TRound) => {
    const createdAt = dayjs(round.createdAt).utc(true).local().toString()
    const startAt = dayjs(round.startAt).utc(true).local().toString()
    const finishAt = dayjs(round.finishAt).utc(true).local().toString()
    return {
        ...round,
        createdAt, startAt, finishAt
    }
}

export const calculateRoundStatus = (round: TRound): ERoundStatus => {

    const date = dayjs()
    const start = dayjs(round.startAt);
    const finish = dayjs(round.finishAt);

    if (date.isBefore(start)) {
        return ERoundStatus.coolDown
    }

    if (date.isAfter(finish)) {
        return ERoundStatus.finished;
    }

    if (date.isAfter(start) && date.isBefore(finish)) {
        return ERoundStatus.active;
    }

    return ERoundStatus.unknown
}

export const convertDiffToString = (diffMs?: number) => {
    if (!diffMs) {
        return
    }
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}