import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const config = {
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: ["query", "error"],
  entities: [__dirname + "src/entities/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
};
export default config;
