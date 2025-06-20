import type {FC} from "react";
import {ERoundStatus} from "../types.ts";

type TGuss = {
    onClick: () => void
    status: ERoundStatus
}

export const Guss: FC<TGuss> = ({onClick, status}) => {
    return (
        <button disabled={status !== ERoundStatus.active}
                className={status !== ERoundStatus.active ? "opacity-50" : "active:opacity-80"} onClick={onClick}>
            <img width={200} src="/guss.webp" alt=""/>
        </button>
    )
}