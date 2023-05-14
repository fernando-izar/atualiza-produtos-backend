import { DataSource } from "typeorm";
import "dotenv/config";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: true,
  synchronize: false,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
});

export default AppDataSource;
