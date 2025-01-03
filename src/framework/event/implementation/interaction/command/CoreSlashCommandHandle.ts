import { BaseEvent } from "@/framework/event/BaseEvent";
import { GuardException } from "@/framework/exception/GuardException";
import type { BaseGuard, BaseGuardTypeMap } from "@/framework/guard/BaseGuard";
import { container } from "@/index";
import { ErrorEmbed } from "@/utilities/embeds/ErrorEmbed";
import { type Interaction, MessageFlags } from "discord.js";

export class CoreSlashCommandHandle extends BaseEvent<"interactionCreate"> {
  constructor() {
    super({
      event: "interactionCreate"
    });
  }

  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild())
      return;

    const slashCommand = container.slashCommands.find(
      command => command.name === interaction.commandName
    );

    if (!slashCommand) {
      interaction.reply({
        embeds: [new ErrorEmbed("Unable to find wanted slash command")],
        flags: [MessageFlags.Ephemeral]
      });
      return;
    }

    if (slashCommand.guards) {
      const failedGuards = [];
      const commandGuards = slashCommand.guards.filter(guard =>
        this.isSpecificGuard(guard, "slashCommand")
      );

      for (const guard of commandGuards) {
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
              "You cannot use this slash command due to a lack of guards"
            )
          ],
          flags: [MessageFlags.Ephemeral]
        });
        return;
      }
    }

    try {
      await slashCommand.execute(interaction);
    } catch (error) {
      interaction.reply({
        embeds: [
          new ErrorEmbed(
            "Failed to execute slash command, error will be reported"
          )
        ],
        flags: [MessageFlags.Ephemeral]
      });
      container.logger.error("Failed to execute slash command");
      container.logger.error(error);
    }
  }

  private isSpecificGuard(
    guard: BaseGuard<keyof BaseGuardTypeMap>,
    type: keyof BaseGuardTypeMap
  ): guard is BaseGuard<typeof type> {
    return guard.type === type;
  }
}
