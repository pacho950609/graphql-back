import 'source-map-support/register';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Connection, createConnection, getConnectionManager } from 'typeorm';
import getConfig from '../ormconfig';

/**
 * Database manager class
 */
export class Database {
    private config: PostgresConnectionOptions;

    constructor() {
        this.config = getConfig(process.env.DB_NAME);
    }

    /**
     * Get a DB connection
     * @returns
     */
    public async getConnection(): Promise<Connection> {
        const connectionManager = getConnectionManager();
        if (!connectionManager.has('potter')) {
            return await createConnection({ ...this.config });
        }
        return connectionManager.get('potter');
    }

    /**
     * Delete db Data (just for testing env)
     * @param connection
     */
    public static async resetConnection(connection: Connection) {
        const entities = connection.entityMetadatas;
        for (const entity of entities) {
            const repository = connection.getRepository(entity.name);
            try {
                await repository.query(
                    `ALTER TABLE ${entity.schema || 'public'}.${entity.tableNameWithoutPrefix} DISABLE TRIGGER ALL;`,
                );

                await repository.query(`DELETE FROM ${entity.schema || 'public'}.${entity.tableNameWithoutPrefix};`);

                await repository.query(
                    `ALTER TABLE ${entity.schema || 'public'}.${entity.tableNameWithoutPrefix} ENABLE TRIGGER ALL;`,
                );
            } catch (e) {
                console.error(`Error while clearing the table ${entity.tableNameWithoutPrefix}`, e);
                throw e;
            }
        }
    }
}
