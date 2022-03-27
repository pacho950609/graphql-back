import { createMatch } from 'handlers/match/match-service';

export const mutations = {
    addMatch: async (root, { input }, { userId }) => {
        if (!userId) {
            throw new Error('Authorization header is required');
        }
        return createMatch(input);
    },
};
