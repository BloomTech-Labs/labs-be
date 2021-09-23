import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

module.exports = {
  url: process.env.DATABASE_URL,
  type: "postgres",
  synchronize: true,
  logging: "all",
  entities: ["./src/entities/**/*.ts"],
  cli: {
    entitiesDir: "./src/entity",
    migrationsDir: "./src/migration",
    subscribersDir: "./src/subscriber",
  },
  migrations: ["./src/migration/**/*.ts"],
  subscribers: ["./src/subscriber/**/*.ts"],
};
