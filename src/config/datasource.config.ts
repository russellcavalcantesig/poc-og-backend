import { DataSource, DataSourceOptions } from 'typeorm'
import 'dotenv/config';

const Config: DataSourceOptions = {
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username:  process.env.DB_USER || "root",
    password:  process.env.DB_PASSWORD || "0f1c1n@2025G4r4G3m",
    database:  process.env.DB_NAME || "og",

    synchronize: false,
    logging: ["error"],
    entities: [
        __dirname + "/../modelos/*{.js,.ts}",
        __dirname + "/../modelos/*/*{.js,.ts}",
        __dirname + "/../modelos/*/*/*{.js,.ts}"
    ],
    subscribers: [],
    migrations: [__dirname + "/../migrations/*{.js,.ts}"],
}

export const AppDataSource = new DataSource(Config)