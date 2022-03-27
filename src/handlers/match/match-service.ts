import { Database } from 'db/Database';
import { Match } from 'entities/Match';
import { Connection } from 'typeorm';

export const createMatch = async (params) => {
    console.log('params', params);
    const database = new Database();
    const connection: Connection = await database.getConnection();
    const { firstPlayerId, secondPlayerId, winnerPlayerId, loserPlayerId } = params;
    const match = new Match();
    match.firstPlayerId = firstPlayerId;
    match.secondPlayerId = secondPlayerId;
    match.winnerPlayerId = winnerPlayerId;
    match.loserPlayerId = loserPlayerId;
    const createdMatch = await connection.manager.save(match);
    return {
        id: createdMatch.id,
        firstPlayerId: createdMatch.firstPlayerId,
        secondPlayerId: createdMatch.secondPlayerId,
        winnerPlayerId: createdMatch.winnerPlayerId,
        loserPlayerId: createdMatch.loserPlayerId,
    };
};
