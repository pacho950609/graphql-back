import { Database } from 'db/Database';
import { Player } from 'entities/Player';
import { Connection } from 'typeorm';
import Chance from 'chance';
import { Match } from 'entities/Match';
import { GameSet } from 'entities/Set';
import { createMatch } from '../match-service';

const chance = new Chance();
const database = new Database();
let connection: Connection;

beforeAll(async () => {
    connection = await database.getConnection();
});

afterAll(async () => {
    await connection.close();
});

describe('Create match', () => {
    beforeEach(async () => {
        await Database.resetConnection(connection);
    });

    test('Ok', async () => {
        const { manager } = connection;
        const player1 = await manager.save(
            new Player({
                name: chance.string(),
                lastName: chance.string(),
            }),
        );

        const player2 = await manager.save(
            new Player({
                name: chance.string(),
                lastName: chance.string(),
            }),
        );

        const match = await createMatch(
            {
                firstPlayerId: player1.id,
                secondPlayerId: player2.id,
                sets: [
                    {
                        firstPlayerPoints: 3,
                        secondPlayerPoints: 11,
                        setNumber: 1,
                    },
                ],
            },
            connection,
        );

        const dbMatch = await manager.findOne(Match, match.id);
        const set = await manager.findOne(GameSet, { matchId: match.id });

        expect(dbMatch.firstPlayerId).toBe(player1.id);
        expect(dbMatch.secondPlayerId).toBe(player2.id);
        expect(dbMatch.winnerPlayerId).toBe(player2.id);
        expect(dbMatch.loserPlayerId).toBe(player1.id);

        expect(set.firstPlayerPoints).toBe(3);
        expect(set.secondPlayerPoints).toBe(11);
    });
});
