import { BaseEvent } from "@/framework/event/BaseEvent";
import { GuardException } from "@/framework/exception/GuardException";
import type { BaseGuard, BaseGuardTypeMap } from "@/framework/guard/BaseGuard";
import type { BaseTriggerTypeMap } from "@/framework/trigger/BaseTrigger";
import { container } from "@/index";
import { ErrorEmbed } from "@/utilities/embeds/ErrorEmbed";
import {
  type ButtonInteraction,
  type ChannelSelectMenuInteraction,
  type Interaction,
  type MentionableSelectMenuInteraction,
  MessageFlags,
  type RoleSelectMenuInteraction,
  type StringSelectMenuInteraction
} from "discord.js";

export class CoreTriggerHandle extends BaseEvent<"interactionCreate"> {
  constructor() {
    super({
      event: "interactionCreate"
    });
  }

  async execute(interaction: Interaction) {
    if (!interaction.inCachedGuild()) return;

    if (interaction.isButton()) {
      await this.handleTrigger(interaction, "button");
    } else if (interaction.isStringSelectMenu()) {
      await this.handleTrigger(interaction, "stringSelectMenu");
    } else if (interaction.isChannelSelectMenu()) {
      await this.handleTrigger(interaction, "channelSelectMenu");
    } else if (interaction.isRoleSelectMenu()) {
      await this.handleTrigger(interaction, "roleSelectMenu");
    } else if (interaction.isMentionableSelectMenu()) {
      await this.handleTrigger(interaction, "mentionableSelectMenu");
    }
  }

  private async handleTrigger(
    interaction:
      | ButtonInteraction<"cached">
      | StringSelectMenuInteraction<"cached">
      | ChannelSelectMenuInteraction<"cached">
      | RoleSelectMenuInteraction<"cached">
      | MentionableSelectMenuInteraction<"cached">,
    type: keyof BaseTriggerTypeMap
  ) {
    const trigger = container.triggers
      .filter(t => t.type === type)
      .find(t =>
        t.startsWith
          ? interaction.customId.startsWith(t.id)
          : t.id === interaction.customId
      );

    if (!trigger) return;

    if (trigger.guards) {
      const failedGuards = [];
      const triggerGuards = trigger.guards.filter(g =>
        this.isSpecificGuard(g, type)
      );

      for (const guard of triggerGuards) {
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
              `You cannot use this ${type} due to a lack of guards`
            )
          ],
          flags: [MessageFlags.Ephemeral]
        });
        return;
      }
    }

    try {
      await trigger.execute(interaction);
    } catch (error) {
      interaction.reply({
        embeds: [
          new ErrorEmbed(
            `Failed to execute ${type} trigger, error will be reported`
          )
        ],
        flags: [MessageFlags.Ephemeral]
      });
      container.logger.error(`Failed to execute ${type} trigger`);
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
