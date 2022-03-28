import { Database } from 'db/Database';
import { Match } from 'entities/Match';
import { GameSet } from 'entities/Set';
import { Connection } from 'typeorm';

export const createMatch = async (
    params: {
        firstPlayerId: string;
        secondPlayerId: string;
        sets: {
            firstPlayerPoints: number;
            secondPlayerPoints: number;
            setNumber: number;
        }[];
    },
    connection: Connection = null,
) => {
    const { sets, firstPlayerId, secondPlayerId } = params;

    const setsWins = sets.reduce(
        (prev, curr) => {
            if (curr.firstPlayerPoints > curr.secondPlayerPoints) {
                return {
                    first: prev.first + 1,
                    second: prev.second,
                };
            }
            return {
                first: prev.first,
                second: prev.second + 1,
            };
        },
        { first: 0, second: 0 },
    );

    const winnerPlayerId = setsWins.first > setsWins.second ? firstPlayerId : secondPlayerId;
    const loserPlayerId = setsWins.first > setsWins.second ? secondPlayerId : firstPlayerId;

    const match = await connection.manager.save(
        new Match({
            firstPlayerId,
            secondPlayerId,
            winnerPlayerId,
            loserPlayerId,
        }),
    );

    const newSets: GameSet[] = [];
    for (const set of sets) {
        const newSet = new GameSet();
        Object.assign(newSet, { ...set, matchId: match.id });
        newSets.push(newSet);
    }
    const createdSets = await connection.manager.save(newSets);

    return {
        id: match.id,
        firstPlayerId: match.firstPlayerId,
        secondPlayerId: match.secondPlayerId,
        winnerPlayerId: match.winnerPlayerId,
        loserPlayerId: match.loserPlayerId,
        sets: createdSets.map((set) => ({
            firstPlayerPoints: set.firstPlayerPoints,
            secondPlayerPoints: set.secondPlayerPoints,
            setNumber: set.setNumber,
        })),
    };
};
