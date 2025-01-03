import type { BaseContextMenuCommandTypeMap } from "@/framework/command/BaseContextMenuCommand";
import { BaseEvent } from "@/framework/event/BaseEvent";
import { container } from "@/index";
import {
  ApplicationCommandType,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  type RESTPostAPIContextMenuApplicationCommandsJSONBody
} from "discord.js";

export class CoreClientReadyEvent extends BaseEvent<"ready"> {
  constructor() {
    super({
      event: "ready"
    });
  }

  async execute() {
    if (container.settings.getBoolean("commands.enabled")) {
      await this.registerCommands();
    } else {
      container.logger.info("Commands are disabled");
    }
  }

  private async registerCommands() {
    const slashCommands = this.getSlashCommandRegistrationData();
    const contextMenuCommands = this.getContextMenuCommandRegistrationData();
    const commands = [...slashCommands, ...contextMenuCommands];

    try {
      if (container.settings.getBoolean("commands.global")) {
        if (!container.client.application) {
          container.logger.warn(
            "Application is not available, no commands will be registered"
          );
          return;
        }

        await container.client.application.commands.set(commands);
      } else {
        const guild = container.client.guilds.cache.get(
          container.settings.getString("commands.guild_id")
        );

        if (!guild) {
          container.logger.warn(
            "Guild is not available, no commands will be registered"
          );
          return;
        }

        await guild.commands.set(commands);
      }
    } catch (error) {
      container.logger.error("Failed to register commands");
      container.logger.error(error);
    } finally {
      container.logger.info(
        "Both slash and context menu commands are registered"
      );
    }
  }

  private getSlashCommandRegistrationData() {
    return container.slashCommands.map(command => {
      const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        name: command.name,
        description: command.description,
        type: ApplicationCommandType.ChatInput
      };

      if (command.options && command.options.length) {
        //@ts-ignore
        data.options = command.options;
      }

      if (command.permissions && command.permissions.length) {
        //@ts-ignore
        data.defaultMemberPermissions = command.permissions;
      }

      return data;
    });
  }

  private getContextMenuCommandRegistrationData() {
    return container.contextMenuCommands.map(command => {
      const commandTypeMap: Record<
        keyof BaseContextMenuCommandTypeMap,
        ApplicationCommandType
      > = {
        messageContextMenuCommand: ApplicationCommandType.Message,
        userContextMenuCommand: ApplicationCommandType.User
      };

      return {
        name: command.name,
        type: commandTypeMap[command.type]
      } as RESTPostAPIContextMenuApplicationCommandsJSONBody;
    });
  }
}
