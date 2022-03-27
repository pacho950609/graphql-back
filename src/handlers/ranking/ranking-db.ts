import { Database } from 'db/Database';
import { Match } from 'entities/Match';
import { Player } from 'entities/Player';
import { Connection } from 'typeorm';

export const getPlayerRanking = async () => {
    const database = new Database();
    const connection: Connection = await database.getConnection();

    return await connection.manager
        .createQueryBuilder(Player, 'player')
        .select([
            'player.id as id',
            'player.name as name',
            'player.last_name as "lastName"',
            'COALESCE(wins.wins,0):: int wins',
            'COALESCE(losses.losses,0):: int losses',
        ])
        .leftJoin(
            (sq) => {
                return sq
                    .select(['count(*) wins', 'winner_player_id'])
                    .from(Match, 'match')
                    .groupBy('winner_player_id');
            },
            'wins',
            'wins.winner_player_id = player.id',
        )
        .leftJoin(
            (sq) => {
                return sq
                    .select(['count(*) losses', 'loser_player_id'])
                    .from(Match, 'match')
                    .groupBy('loser_player_id');
            },
            'losses',
            'losses.loser_player_id = player.id',
        )
        .orderBy('wins', 'DESC')
        .orderBy('losses', 'ASC')
        .getRawMany();
};
