import { Match } from 'entities/Match';
import { GameSet } from 'entities/Set';
import { Connection } from 'typeorm';
import _ from 'lodash';

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
        throw new Error(`Points difference must be two in set ${set.setNumber}`);
    } else if (set.firstPlayerPoints > set.secondPlayerPoints) {
        if (set.firstPlayerPoints < 11 || (set.firstPlayerPoints > 11 && set.secondPlayerPoints < 10))
            throw new Error(`Set must end at 11 points in set in set ${set.setNumber}`);
    } else if (set.secondPlayerPoints > set.firstPlayerPoints) {
        if (set.secondPlayerPoints < 11 || (set.secondPlayerPoints > 11 && set.firstPlayerPoints < 10))
            throw new Error(`Set must end at 11 points in set in set ${set.setNumber}`);
    } else if (set.firstPlayerPoints === set.secondPlayerPoints) {
        throw new Error(`There must be a winner in the set ${set.setNumber}`);
    }
};

export const validateSets = (sets: GameSetI[]) => {
    _.range(sets.length).map((setNumber) => {
        const set = sets.find((gameSet) => gameSet.setNumber === setNumber + 1);
        if (!set) {
            throw new Error(`Doesn't exist a set with number ${setNumber + 1}`);
        }
        validateSet(set);
    });
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
    validateSets(sets);

    if (sets.length > 5) {
        throw new Error('Max sets number is 5');
    }

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

    if (setsWins.first > 3 || setsWins.second > 3) {
        throw new Error('Game ends after win 3 sets');
    }

    if (setsWins.first !== 3 && setsWins.second !== 3) {
        throw new Error('There must be a winner');
    }

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
