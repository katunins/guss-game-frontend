import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { ERoundStatus, type TRound, type TTap } from "../types.ts";
import { ApiService } from "../services/api.service.ts";
import { convertDiffToString, convertRoundDate } from "../helpers.ts";
import { useRoundStatus } from "../hooks/useRoundStatus.ts";
import { Guss } from "../components/Guss.tsx";
import { io, Socket } from 'socket.io-client';
import { AuthService } from "../services/auth.service.ts";

enum EConnect {
    unknown = 'unknown',
    connected = 'connected',
    disconnected = 'disconnected'
}

export const Round = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [round, setRound] = useState<TRound | undefined>()
    const [isInitialazed, setIsInitialazed] = useState(false)
    const [connectStatus, setConnectStatus] = useState(EConnect.unknown)

    const { status, toStart, toFinish } = useRoundStatus(round)
    const socketRef = useRef<Socket>(null);

    useEffect(() => {
        if (!uuid) {
            return
        }
        ApiService.createTap(uuid).then(() => setIsInitialazed(true))
    }, [uuid])

    useEffect(() => {
        if (!uuid) {
            return
        }
        ApiService.getRound(uuid).then(result => {
            if (result) {
                if (status === ERoundStatus.finished) {
                    socketRef.current?.disconnect()
                }
                setRound(convertRoundDate(result))
            }
        })
    }, [status, uuid, socketRef])

    useEffect(() => {
        if (!uuid || status === ERoundStatus.finished) {
            return
        }
        socketRef.current = io(import.meta.env.VITE_API_URL, {
            query: { round_uuid: uuid }, extraHeaders: {
                'Authorization': `Bearer ${AuthService.token}`
            }
        });

        socketRef.current.on('connect', () => {
            console.log('Socket.io connected');
            setConnectStatus(EConnect.connected)
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket.io disconnected');
            setConnectStatus(EConnect.disconnected)
        });

        socketRef.current.on('update', (payload?: TTap) => {
            console.log('update', payload);

            if (payload && 'count' in payload && 'id' in payload) {
                setRound(prevState => {

                    if (!prevState) {
                        return undefined
                    }

                    return {
                        ...prevState,
                        taps: prevState.taps.length
                            ? prevState.taps.map(tap => tap.id === payload.id ? { ...tap, count: payload.count } : tap)
                            : [{ id: payload.id, count: payload.count, user: { username: AuthService.user?.username, isAdmin: AuthService.user?.isAdmin } }]
                    } as TRound
                })
            }
        });
    }, [uuid, status, socketRef]);

    const handleClick = useCallback(() => {
        if (socketRef.current && uuid) {
            socketRef.current.emit('click', { round_uuid: uuid, username: AuthService.user?.username });
        }
    }, [uuid, socketRef]);

    const myCount = useMemo(() => {
        return round?.taps?.find(tap => tap.user.username === AuthService.user?.username)?.count || 0

    }, [AuthService.user, round])

    const winnerTap = useMemo(() => {
        return [...round?.taps || []].sort((tapA, tabB) => tabB.count - tapA.count)?.[0]

    }, [round])

    const total = useMemo(() => {
        return round?.taps?.reduce((total, tap) => total + tap.count, 0)
    }, [round])

    const content = useMemo(() => {
        switch (status) {
            case ERoundStatus.coolDown:
                return (
                    <>
                        <div className="mb-5">
                            <Guss onClick={handleClick} status={status} />
                        </div>
                        <p>Cooldown</p>
                        <p>до начала раунда {convertDiffToString(toStart)}</p>
                    </>
                )
            case ERoundStatus.active:
                return (
                    <>
                        <div className="mb-5"><Guss onClick={handleClick} status={status} /></div>
                        <p>Раунд активен!</p>
                        <p>до конца раунда орсталось {convertDiffToString(toFinish)}</p>
                        <p>Мои очки - {myCount}</p>
                    </>
                )
            case ERoundStatus.finished:
                return (
                    <>
                        <div className="mb-5">
                            <Guss onClick={handleClick} status={status} />
                        </div>
                        <p>Всего {total}</p>
                        <p>Победитель - {winnerTap?.user?.username} {winnerTap?.count}</p>
                        <p>Мои очки - {myCount}</p>
                    </>
                )
        }
    }, [status, handleClick, toStart, toFinish, total])

    if (!round || !isInitialazed) {
        return (
            <p>Loading ...</p>
        )
    }

    return (
        <div className="container h-full">
            <p className="text-right">
                Server <span className={connectStatus === EConnect.connected ? "font-bold text-green-600" : "font-bold text-red-500"}>{connectStatus === EConnect.connected ? "connected" : "disconnected"}</span>
            </p>
            <div className="h-full flex flex-col justify-center items-center gap-3">
                {content}
            </div>
        </div>
    )

}