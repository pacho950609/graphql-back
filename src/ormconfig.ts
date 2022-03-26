import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const getConfig = (name: string): PostgresConnectionOptions => {
    return {
        name,
        type: 'postgres',
        host: process.env.DB_URL,
        port: 5432,
        synchronize: true,
        migrationsRun: false,
        namingStrategy: new SnakeNamingStrategy(),
        logging: false,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: name,
        entities: ['lib/entities/*.js'],
    };
};
export default getConfig;
