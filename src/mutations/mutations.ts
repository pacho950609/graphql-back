import { createMatch } from 'handlers/match/match-service';

export const mutations = {
    addMatch: async (root, { input }) => {
        return createMatch(input);
    },
};
