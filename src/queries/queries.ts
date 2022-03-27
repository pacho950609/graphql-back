import { getPlayerRanking } from 'handlers/ranking/ranking-db';

export const queries = {
    getRank: async () => {
        return await getPlayerRanking();
    },
    getBest: async (root, params) => {
        return (await getPlayerRanking())[0];
    },
};
