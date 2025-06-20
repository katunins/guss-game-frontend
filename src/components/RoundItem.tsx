import {type FC} from "react";
import {useNavigate} from "react-router-dom";
import dayjs from 'dayjs';
import {ROUND_STATUS_COLOR_CLASS, ROUND_STATUS_NAME, TIME_FORMAT} from "../const.ts";
import {type TRound} from "../types.ts";
import {useRoundStatus} from "../../hooks/useRoundStatus.ts";

export const RoundItem: FC<TRound> = (round) => {

    const navigate = useNavigate()
    const {status} = useRoundStatus(round)

    return (
        <button
            className="text-left relative w-96"
            onClick={() => navigate(`/round/${round.uuid}`)}
        >
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center mb-3">
                    <div className={`w-3 h-3 rounded-full ${ROUND_STATUS_COLOR_CLASS[status]}`}/>
                    <span>ID: {round.uuid}</span>
                </div>
            </div>
            <p>Start: {dayjs(round.startAt).format(TIME_FORMAT)}</p>
            <p>End: {dayjs(round.finishAt).format(TIME_FORMAT)}</p>
            <div className="w-full bg-gray-400 h-[1px] my-4"/>
            <p>{ROUND_STATUS_NAME[status]}</p>
        </button>
    )
}