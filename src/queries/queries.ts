import { getPlayerRanking, getPlayers } from 'services/ranking/ranking-service';
import { wrapper } from 'utils/wrapper';

export const queries = {
    getRank: async () => {
        return await wrapper(async (connection) => await getPlayerRanking(connection));
    },
    getPlayers: async () => {
        return await wrapper(async (connection) => await getPlayers(connection));
    },
};
