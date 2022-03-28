import { createMatch } from 'services/match/match-service';
import { wrapper } from 'utils/wrapper';

export const mutations = {
    addMatch: async (root, { input }, { userId }) => {
        return await wrapper(async (connection) => {
            if (!userId) {
                throw new Error('Authorization header is required');
            }
            return await createMatch(input, connection);
        });
    },
};
