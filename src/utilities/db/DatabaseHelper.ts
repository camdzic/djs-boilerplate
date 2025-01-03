import { AppDataSource } from "@/utilities/db/AppDataSource";
import { UserEntity } from "@/utilities/db/entities/UserEntity";

const users = AppDataSource.getRepository(UserEntity);

class UserHelper {
  async get() {
    return await users.find();
  }

  async getOne(id: string, guildId: string) {
    const userEntity = await users.findOneBy({ id, guildId });

    if (!userEntity) {
      const newUserEntity = users.create({ id, guildId });

      return await users.save(newUserEntity);
    }

    return userEntity;
  }

  async update(id: string, guildId: string, data: Partial<UserEntity>) {
    const userEntity = await this.getOne(id, guildId);

    return await users.save({ ...userEntity, ...data });
  }

  async delete(id: string, guildId: string) {
    const userEntity = await this.getOne(id, guildId);

    return await users.remove(userEntity);
  }
}

export class DatabaseHelper {
  readonly users: UserHelper;

  constructor() {
    this.users = new UserHelper();
  }
}
