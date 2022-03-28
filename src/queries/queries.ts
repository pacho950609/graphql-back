import { getPlayerRanking, getPlayers } from 'services/ranking/ranking-service';
import { wrapper } from 'utils/wrapper';

/**
 * List of graphql allowed queries 
 */
export const queries = {
    getRank: async () => {
        return await wrapper(async (connection) => await getPlayerRanking(connection));
    },
    getPlayers: async () => {
        return await wrapper(async (connection) => await getPlayers(connection));
    },
};
