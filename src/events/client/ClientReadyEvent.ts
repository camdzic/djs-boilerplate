import { BaseEvent } from "@/framework";
import { container } from "@/index";
import { AppDataSource } from "@/utilities/db/AppDataSource";

export class ClientReadyEvent extends BaseEvent<"ready"> {
  constructor() {
    super({
      event: "ready"
    });
  }

  async execute() {
    await this.connectToDatabase();

    container.logger.info("Bot is ready!");
  }

  async connectToDatabase() {
    try {
      await AppDataSource.initialize();
      container.logger.info("Connected to the database");
    } catch (error) {
      container.logger.error("Failed to connect to the database");
      container.logger.error(error);
    }
  }
}
