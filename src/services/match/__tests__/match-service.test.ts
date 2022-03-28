import { Database } from 'db/Database';
import { Player } from 'entities/Player';
import { Connection } from 'typeorm';
import Chance from 'chance';
import { Match } from 'entities/Match';
import { GameSet } from 'entities/Set';
import { createMatch, validateSets } from '../match-service';

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
                    {
                        firstPlayerPoints: 4,
                        secondPlayerPoints: 11,
                        setNumber: 2,
                    },
                    {
                        firstPlayerPoints: 5,
                        secondPlayerPoints: 11,
                        setNumber: 3,
                    },
                ],
            },
            connection,
        );

        const dbMatch = await manager.findOne(Match, match.id);
        const sets = await manager.find(GameSet, { matchId: match.id });

        expect(dbMatch.firstPlayerId).toBe(player1.id);
        expect(dbMatch.secondPlayerId).toBe(player2.id);
        expect(dbMatch.winnerPlayerId).toBe(player2.id);
        expect(dbMatch.loserPlayerId).toBe(player1.id);

        expect(sets.find((set) => set.setNumber === 1).firstPlayerPoints).toBe(3);
        expect(sets.find((set) => set.setNumber === 1).secondPlayerPoints).toBe(11);

        expect(sets.find((set) => set.setNumber === 2).firstPlayerPoints).toBe(4);
        expect(sets.find((set) => set.setNumber === 2).secondPlayerPoints).toBe(11);

        expect(sets.find((set) => set.setNumber === 3).firstPlayerPoints).toBe(5);
        expect(sets.find((set) => set.setNumber === 3).secondPlayerPoints).toBe(11);
    });

    test('Error - there must be a winner', async () => {
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

        await expect(
            createMatch(
                {
                    firstPlayerId: player1.id,
                    secondPlayerId: player2.id,
                    sets: [
                        {
                            firstPlayerPoints: 3,
                            secondPlayerPoints: 11,
                            setNumber: 1,
                        },
                        {
                            firstPlayerPoints: 4,
                            secondPlayerPoints: 11,
                            setNumber: 2,
                        },
                        {
                            firstPlayerPoints: 11,
                            secondPlayerPoints: 5,
                            setNumber: 3,
                        },
                    ],
                },
                connection,
            ),
        ).rejects.toThrow();
    });

    test('Error - game ends after 3 win sets', async () => {
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

        await expect(
            createMatch(
                {
                    firstPlayerId: player1.id,
                    secondPlayerId: player2.id,
                    sets: [
                        {
                            firstPlayerPoints: 3,
                            secondPlayerPoints: 11,
                            setNumber: 1,
                        },
                        {
                            firstPlayerPoints: 4,
                            secondPlayerPoints: 11,
                            setNumber: 2,
                        },
                        {
                            firstPlayerPoints: 5,
                            secondPlayerPoints: 11,
                            setNumber: 3,
                        },
                        {
                            firstPlayerPoints: 6,
                            secondPlayerPoints: 11,
                            setNumber: 4,
                        },
                    ],
                },
                connection,
            ),
        ).rejects.toThrow();
    });

    test('Error - max 5 sets', async () => {
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

        await expect(
            createMatch(
                {
                    firstPlayerId: player1.id,
                    secondPlayerId: player2.id,
                    sets: [
                        {
                            firstPlayerPoints: 3,
                            secondPlayerPoints: 11,
                            setNumber: 1,
                        },
                        {
                            firstPlayerPoints: 4,
                            secondPlayerPoints: 11,
                            setNumber: 2,
                        },
                        {
                            firstPlayerPoints: 5,
                            secondPlayerPoints: 11,
                            setNumber: 3,
                        },
                        {
                            firstPlayerPoints: 6,
                            secondPlayerPoints: 11,
                            setNumber: 4,
                        },
                        {
                            firstPlayerPoints: 6,
                            secondPlayerPoints: 11,
                            setNumber: 4,
                        },
                        {
                            firstPlayerPoints: 6,
                            secondPlayerPoints: 11,
                            setNumber: 4,
                        },
                    ],
                },
                connection,
            ),
        ).rejects.toThrow();
    });
});

describe('Validate sets', () => {
    beforeEach(async () => {
        await Database.resetConnection(connection);
    });

    test('Ok', async () => {
        expect(() => {
            validateSets([
                {
                    firstPlayerPoints: 3,
                    secondPlayerPoints: 11,
                    setNumber: 1,
                },
                {
                    firstPlayerPoints: 4,
                    secondPlayerPoints: 11,
                    setNumber: 2,
                },
                {
                    firstPlayerPoints: 5,
                    secondPlayerPoints: 11,
                    setNumber: 3,
                },
            ]);
        }).not.toThrow();
    });

    test('Error - invalid set number', async () => {
        expect(() => {
            validateSets([
                {
                    firstPlayerPoints: 3,
                    secondPlayerPoints: 11,
                    setNumber: 1,
                },
                {
                    firstPlayerPoints: 4,
                    secondPlayerPoints: 11,
                    setNumber: 2,
                },
                {
                    firstPlayerPoints: 5,
                    secondPlayerPoints: 11,
                    setNumber: 4,
                },
            ]);
        }).toThrow();
    });

    test('Error - two points difference', async () => {
        expect(() => {
            validateSets([
                {
                    firstPlayerPoints: 3,
                    secondPlayerPoints: 11,
                    setNumber: 1,
                },
                {
                    firstPlayerPoints: 10,
                    secondPlayerPoints: 11,
                    setNumber: 2,
                },
                {
                    firstPlayerPoints: 5,
                    secondPlayerPoints: 11,
                    setNumber: 3,
                },
            ]);
        }).toThrow();
    });

    test('Error - not finished set', async () => {
        expect(() => {
            validateSets([
                {
                    firstPlayerPoints: 3,
                    secondPlayerPoints: 11,
                    setNumber: 1,
                },
                {
                    firstPlayerPoints: 6,
                    secondPlayerPoints: 1,
                    setNumber: 2,
                },
                {
                    firstPlayerPoints: 5,
                    secondPlayerPoints: 11,
                    setNumber: 3,
                },
            ]);
        }).toThrow();
    });

    test('Error - set finish at 11 points', async () => {
        expect(() => {
            validateSets([
                {
                    firstPlayerPoints: 3,
                    secondPlayerPoints: 11,
                    setNumber: 1,
                },
                {
                    firstPlayerPoints: 6,
                    secondPlayerPoints: 13,
                    setNumber: 2,
                },
                {
                    firstPlayerPoints: 5,
                    secondPlayerPoints: 11,
                    setNumber: 3,
                },
            ]);
        }).toThrow();
    });
});
