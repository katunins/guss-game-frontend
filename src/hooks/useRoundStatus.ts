import {ERoundStatus, type TRound} from "../src/types";
import {useCallback, useEffect, useState} from "react";
import {calculateRoundStatus} from "../src/helpers";
import dayjs from "dayjs";

export const useRoundStatus = (round?: TRound) => {
    let interval: number
    const [status, setStatus] = useState(ERoundStatus.unknown)
    const [toStart, setToStart] = useState<number>()
    const [toFinish, setToFinish] = useState<number>()

    const updateStatus = useCallback(() => {
        if (!round) {
            return
        }
        setStatus(calculateRoundStatus(round))

        setToStart(status === ERoundStatus.coolDown ? dayjs(round.startAt).diff(dayjs()) : undefined)
        setToFinish(status === ERoundStatus.active ? dayjs(round.finishAt).diff(dayjs()) : undefined)

        if (status === ERoundStatus.finished) {
            clearInterval(interval)
        }
    }, [status, setStatus, round])

    useEffect(() => {
        updateStatus()
        interval = setInterval(updateStatus, 1000)
        return () => clearInterval(interval)
    }, [updateStatus])

    if (!round) {
        return {status: ERoundStatus.unknown}
    }

    return {status, toStart, toFinish}
}