import { getPlayerRanking, getPlayers } from 'services/ranking/ranking-db';

export const queries = {
    getRank: async () => {
        return await getPlayerRanking();
    },
    getPlayers: async () => {
        return await getPlayers();
    },
};
