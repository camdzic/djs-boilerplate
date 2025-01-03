import { UserEntity } from "@/utilities/db/entities/UserEntity";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db/db.sqlite",
  synchronize: true,
  logging: false,
  entities: [UserEntity]
});
