import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { ERoundStatus, type TRound, type TTap } from "../types.ts";
import { ApiService } from "../services/api.service.ts";
import { convertDiffToString, convertRoundDate } from "../helpers.ts";
import { useRoundStatus } from "../../hooks/useRoundStatus.ts";
import { Guss } from "../components/Guss.tsx";
import { io } from 'socket.io-client';
import { AuthService } from "../services/auth.service.ts";

export const Round = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [round, setRound] = useState<TRound | undefined>()


    const { status, toStart, toFinish } = useRoundStatus(round)
    const socketRef = useRef<any>(null);

    useEffect(() => {
        if (!uuid) {
            return
        }
        ApiService.getRound(uuid).then(result => {
            if (result) {
                setRound(convertRoundDate(result))
            }
        })
    }, [status, uuid])

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
                            : [{ id: payload.id, count: payload.count, user: { username: AuthService.user?.username } }]
                    }
                })
                // setPoints(payload.count)
            }
        });

        socketRef.current.on('disconnect', () => {
            // navigate('/')
            console.log('Socket.io disconnected');
        });

        return () => {
            socketRef.current.disconnect();
            socketRef.current = null;
        };
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
        return round?.taps?.reduce((total, tap)=>total + tap.count, 0)

    }, [round])

    if (!round) {
        return (
            <p>Loading ...</p>
        )
    }


    switch (status) {
        case ERoundStatus.coolDown:
            return (
                <>
                    <Guss onClick={handleClick} status={status} />
                    <p>Cooldown</p>
                    <p>до начала раунда {convertDiffToString(toStart)}</p>
                </>
            )
        case ERoundStatus.active:
            return (
                <>
                    <Guss onClick={handleClick} status={status} />
                    <p>Раунд активен!</p>
                    <p>до конца раунда орсталось {convertDiffToString(toFinish)}</p>
                    <p>Мои очки - {myCount}</p>
                </>
            )
        case ERoundStatus.finished:
            return (
                <>
                    <Guss onClick={handleClick} status={status} />
                    <p>Всего {total}</p>
                    <p>Победитель - {winnerTap?.user?.username} {winnerTap?.count}</p>
                    <p>Мои очки - {myCount}</p>
                </>
            )
    }
}