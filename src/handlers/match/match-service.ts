import { Database } from 'db/Database';
import { Match } from 'entities/Match';
import { GameSet } from 'entities/Set';
import { Connection } from 'typeorm';

export const createMatch = async (params) => {
    const database = new Database();
    const connection: Connection = await database.getConnection();

    const {
        sets,
        ...rest
    }: {
        firstPlayerId: string;
        secondPlayerId: string;
        winnerPlayerId: string;
        loserPlayerId: string;
        sets: {
            firstPlayerPoints: number;
            secondPlayerPoints: number;
            setNumber: number;
        }[];
    } = params;

    const match = new Match();
    Object.assign(match, { ...rest });
    const createdMatch = await connection.manager.save(match);

    const newSets: GameSet[] = [];
    for (const set of sets) {
        const newSet = new GameSet();
        Object.assign(newSet, { ...set, matchId: createdMatch.id });
        newSets.push(newSet);
    }
    const createdSets = await connection.manager.save(newSets);

    return {
        id: createdMatch.id,
        firstPlayerId: createdMatch.firstPlayerId,
        secondPlayerId: createdMatch.secondPlayerId,
        winnerPlayerId: createdMatch.winnerPlayerId,
        loserPlayerId: createdMatch.loserPlayerId,
        sets: createdSets.map((set) => ({
            firstPlayerPoints: set.firstPlayerPoints,
            secondPlayerPoints: set.secondPlayerPoints,
            setNumber: set.setNumber,
        })),
    };
};
