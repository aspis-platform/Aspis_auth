import { DataSource } from "typeorm";
import {config} from 'dotenv'
config({path:'env.local'});

export default new DataSource({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'donggun',
    password:'hugh1124**',
    database:'postgres',
    entities:[__dirname+'src/**/*.entity.{.ts,.js}'],
    migrations:['src/database/migrations/*.ts'],
    migrationsTableName:'migrations',
})