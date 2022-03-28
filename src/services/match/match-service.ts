import { Match } from 'entities/Match';
import { GameSet } from 'entities/Set';
import { Connection } from 'typeorm';

interface GameSetI {
    firstPlayerPoints: number;
    secondPlayerPoints: number;
    setNumber: number;
}
export const validateSet = (set: GameSetI) => {
    if (
        set.firstPlayerPoints >= 10 &&
        set.secondPlayerPoints >= 10 &&
        Math.abs(set.firstPlayerPoints - set.secondPlayerPoints) !== 2
    ) {
        throw new Error('Points difference must be two');
    } else if (set.firstPlayerPoints > set.secondPlayerPoints) {
        if (set.firstPlayerPoints < 11 || set.firstPlayerPoints > 11) throw new Error('Set ends at 11 points');
    } else if (set.secondPlayerPoints > set.firstPlayerPoints) {
        if (set.secondPlayerPoints < 11 || set.secondPlayerPoints > 11) throw new Error('Set ends at 11 points');
    } else if (set.firstPlayerPoints === set.secondPlayerPoints) {
        throw new Error('There must be a winner in the set');
    }
};

export const createMatch = async (
    params: {
        firstPlayerId: string;
        secondPlayerId: string;
        sets: GameSetI[];
    },
    connection: Connection = null,
) => {
    const { sets, firstPlayerId, secondPlayerId } = params;
    sets.map((set) => validateSet(set));

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
