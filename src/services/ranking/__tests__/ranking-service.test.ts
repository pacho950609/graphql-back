import { Database } from 'db/Database';
import { Player } from 'entities/Player';
import { Connection } from 'typeorm';
import Chance from 'chance';
import { Match } from 'entities/Match';
import { getPlayerRanking } from '../ranking-service';

const chance = new Chance();
const database = new Database();
let connection: Connection;

beforeAll(async () => {
    connection = await database.getConnection();
});

afterAll(async () => {
    await connection.close();
});

describe('Test rank query', () => {
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

        const player3 = await manager.save(
            new Player({
                name: chance.string(),
                lastName: chance.string(),
            }),
        );

        await manager.save(
            new Match({
                firstPlayerId: player1.id,
                secondPlayerId: player2.id,
                winnerPlayerId: player2.id,
                loserPlayerId: player1.id,
            }),
        );

        await manager.save(
            new Match({
                firstPlayerId: player1.id,
                secondPlayerId: player2.id,
                winnerPlayerId: player2.id,
                loserPlayerId: player1.id,
            }),
        );

        await manager.save(
            new Match({
                firstPlayerId: player2.id,
                secondPlayerId: player3.id,
                winnerPlayerId: player2.id,
                loserPlayerId: player3.id,
            }),
        );

        const rank = await getPlayerRanking(connection);

        expect(rank.find((p) => p.id === player1.id).wins).toBe(0);
        expect(rank.find((p) => p.id === player1.id).losses).toBe(2);

        expect(rank.find((p) => p.id === player2.id).wins).toBe(3);
        expect(rank.find((p) => p.id === player2.id).losses).toBe(0);

        expect(rank.find((p) => p.id === player3.id).wins).toBe(0);
        expect(rank.find((p) => p.id === player3.id).losses).toBe(1);

        expect(rank.length).toBe(3);
        expect(rank[0]?.id).toBe(player2.id);
        expect(rank[1]?.id).toBe(player3.id);
        expect(rank[2]?.id).toBe(player1.id);
    });
});
