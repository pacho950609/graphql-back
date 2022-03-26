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

    public async getConnection(): Promise<Connection> {
        const connectionManager = getConnectionManager();
        if(!connectionManager.has('potter')){
            return await createConnection({...this.config});
        } else {
            return connectionManager.get('potter')
        }
    }
}
