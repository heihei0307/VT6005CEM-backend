import {DataSource, DataSourceOptions} from "typeorm";
import * as dotenv from 'dotenv'
import * as mysql2 from "mysql2/promise";
import {Users} from "../entities/users";
import {Appointments} from "../entities/appointments";

dotenv.config()

const AppDataSourceOptions: DataSourceOptions = {
    type: "mysql",
    connectorPackage: "mysql2",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Users, Appointments]
}
const AppDataSource = new DataSource(AppDataSourceOptions)

const AutoCreateDatabase = async () => {
    const connection = await mysql2.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    })
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
}

export default {AppDataSource, AutoCreateDatabase}
