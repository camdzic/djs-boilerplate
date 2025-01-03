import type { BaseContextMenuCommandTypeMap } from "@/framework/command/BaseContextMenuCommand";
import { BaseEvent } from "@/framework/event/BaseEvent";
import { GuardException } from "@/framework/exception/GuardException";
import type { BaseGuard, BaseGuardTypeMap } from "@/framework/guard/BaseGuard";
import { container } from "@/index";
import { ErrorEmbed } from "@/utilities/embeds/ErrorEmbed";
import type {
  Interaction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from "discord.js";

export class CoreContextMenuCommandHandle extends BaseEvent<"interactionCreate"> {
  constructor() {
    super({
      event: "interactionCreate"
    });
  }

  async execute(interaction: Interaction) {
    if (!interaction.inCachedGuild()) return;

    if (interaction.isMessageContextMenuCommand()) {
      await this.handleContextMenuCommand(
        interaction,
        "messageContextMenuCommand"
      );
    } else if (interaction.isUserContextMenuCommand()) {
      await this.handleContextMenuCommand(
        interaction,
        "userContextMenuCommand"
      );
    }
  }

  private async handleContextMenuCommand(
    interaction:
      | MessageContextMenuCommandInteraction<"cached">
      | UserContextMenuCommandInteraction<"cached">,
    type: keyof BaseContextMenuCommandTypeMap
  ) {
    const contextMenuCommand = container.contextMenuCommands
      .filter(command => command.type === type)
      .find(command => command.name === interaction.commandName);

    if (!contextMenuCommand) {
      interaction.reply({
        embeds: [new ErrorEmbed("Unable to find wanted context menu command")],
        flags: ["Ephemeral"]
      });
      return;
    }

    if (contextMenuCommand.guards) {
      const failedGuards = [];
      const contextMenuCommandGuards = contextMenuCommand.guards.filter(guard =>
        this.isSpecificGuard(guard, type)
      );

      for (const guard of contextMenuCommandGuards) {
        try {
          await guard.execute(interaction);
        } catch (error) {
          if (error instanceof GuardException) {
            failedGuards.push(error.message);
          }
        }
      }

      if (failedGuards.length) {
        interaction.reply({
          embeds: [
            new ErrorEmbed(
              "You cannot use this context menu command due to a lack of guards"
            )
          ],
          flags: ["Ephemeral"]
        });
        return;
      }
    }

    try {
      await contextMenuCommand.execute(interaction);
    } catch (error) {
      interaction.reply({
        embeds: [
          new ErrorEmbed(
            "Failed to execute context menu command, error will be reported"
          )
        ],
        flags: ["Ephemeral"]
      });
      container.logger.error("Failed to execute context menu command");
      container.logger.error(error);
    }
  }

  private isSpecificGuard(
    guard: BaseGuard<keyof BaseGuardTypeMap>,
    type: keyof BaseGuardTypeMap
  ): guard is BaseGuard<typeof type> | BaseGuard<"any"> {
    return guard.type === type || guard.type === "any";
  }
}
