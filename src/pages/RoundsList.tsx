import { useCallback, useEffect, useState } from "react";
import { ApiService } from "../services/api.service.ts";
import { AuthService } from "../services/auth.service.ts";
import { RoundItem } from "../components/RoundItem.tsx";
import type { TRound } from "../types.ts";
import { convertRoundDate } from "../helpers.ts";
import { useNavigate } from "react-router-dom";

export const RoundsList = () => {
    const [rounds, setRounds] = useState<TRound[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setIsLoading(true)
        ApiService.getRounds().then(rounds => {
            setIsLoading(false)
            if (rounds) {
                setRounds(rounds.map(round => {
                    return (convertRoundDate(round))
                }))
            }
        })
    }, [])

    const handleCreateRound = useCallback(async () => {
        setIsLoading(true)
        const round = await ApiService.createRound()
        setIsLoading(false)
        if (!round) {
            return
        }
        setRounds(prevState => ([...prevState, convertRoundDate(round)]))
        navigate(`/round/${round.uuid}`)
    }, [])

    const deleteHandler = (round: TRound) => {
        ApiService.deleteRound(round.uuid)
            .then(
                () => setRounds(prevState => prevState
                    .filter(item => item.uuid !== round.uuid))
            )
    }

    return (
        <div className='text-center space-y-6'>
            {isLoading && <p>Loading ...</p>}
            {!isLoading && !rounds.length && <p>Нет доступных раундов</p>}
            {!isLoading && !rounds.length && !AuthService.user?.isAdmin &&
                <p>Попросите админа создать раунд и прислать вам ссылку</p>}
            <ul className="space-y-2">
                {rounds.map(round => {
                    return (
                        <li className="py-3 px-4 border-gray-600 border-1 rounded text-sm flex gap-2"
                            key={round.uuid}>
                            <RoundItem {...round} />
                            <button className="flex items-start" onClick={() => deleteHandler(round)}>x</button>
                        </li>

                    )
                })}
            </ul>
            {AuthService.user?.isAdmin && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={isLoading}
                    onClick={handleCreateRound}
                >
                    Добавить раунд
                </button>
            )}
        </div>
    )
}