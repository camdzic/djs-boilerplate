import type { BaseComponentTypeMap } from "@/framework/component/BaseComponent";
import { BaseEvent } from "@/framework/event/BaseEvent";
import { container } from "@/index";
import { ErrorEmbed } from "@/utilities/embeds/ErrorEmbed";
import {
  ActionRowBuilder,
  BaseSelectMenuBuilder,
  ButtonBuilder,
  type ButtonInteraction,
  type ChannelSelectMenuInteraction,
  type Interaction,
  type MentionableSelectMenuInteraction,
  type MessageActionRowComponentBuilder,
  MessageFlags,
  type ModalSubmitInteraction,
  type RoleSelectMenuInteraction,
  type StringSelectMenuInteraction
} from "discord.js";

export class CoreComponentHandle extends BaseEvent<"interactionCreate"> {
  constructor() {
    super({
      event: "interactionCreate"
    });
  }

  async execute(interaction: Interaction) {
    if (!interaction.inCachedGuild()) return;

    if (interaction.isButton()) {
      await this.handleComponent(interaction, "button");
    } else if (interaction.isStringSelectMenu()) {
      await this.handleComponent(interaction, "stringSelectMenu");
    } else if (interaction.isChannelSelectMenu()) {
      await this.handleComponent(interaction, "channelSelectMenu");
    } else if (interaction.isRoleSelectMenu()) {
      await this.handleComponent(interaction, "roleSelectMenu");
    } else if (interaction.isMentionableSelectMenu()) {
      await this.handleComponent(interaction, "mentionableSelectMenu");
    } else if (interaction.isModalSubmit()) {
      await this.handleComponent(interaction, "modal");
    }
  }

  async handleComponent(
    interaction:
      | ButtonInteraction<"cached">
      | StringSelectMenuInteraction<"cached">
      | ChannelSelectMenuInteraction<"cached">
      | RoleSelectMenuInteraction<"cached">
      | MentionableSelectMenuInteraction<"cached">
      | ModalSubmitInteraction<"cached">,
    type: keyof BaseComponentTypeMap
  ) {
    const component = container.components
      .filter(c => c.type === type)
      .find(c => c.id === interaction.customId);

    if (!component) return;

    if (
      component.allowedExecutorIds.length &&
      !component.allowedExecutorIds.includes(interaction.user.id)
    ) {
      interaction.reply({
        embeds: [
          new ErrorEmbed("This component is meant for someone else to execute")
        ],
        flags: [MessageFlags.Ephemeral]
      });
      return;
    }

    try {
      await component.execute(interaction);

      if (component.renewOnInteract) {
        clearTimeout(component.timeout);

        component.timeout = setTimeout(() => {
          container.components = container.components.filter(
            c => c.type !== type || c.id !== interaction.customId
          );
        }, component.executionThreshold);

        return;
      }

      if (component.disposeOnInteract) {
        container.components = container.components.filter(
          c => c.type !== type || c.id !== interaction.customId
        );

        if (interaction.message) {
          const updatedMessageComponents = interaction.message.components.map(
            row => {
              const newRow = ActionRowBuilder.from(row);

              for (const component of newRow.components) {
                if ("custom_id" in component.data) {
                  if (
                    (component instanceof BaseSelectMenuBuilder ||
                      component instanceof ButtonBuilder) &&
                    component.data.custom_id === interaction.customId
                  ) {
                    component.setDisabled(true);
                  }
                }
              }

              return newRow as ActionRowBuilder<MessageActionRowComponentBuilder>;
            }
          );

          interaction.message.edit({ components: updatedMessageComponents });
        }
      }
    } catch (error) {
      interaction.reply({
        embeds: [
          new ErrorEmbed(
            `Failed to execute ${type} component, error will be reported`
          )
        ],
        flags: [MessageFlags.Ephemeral]
      });
      container.logger.error(`Failed to execute ${type} component`);
      container.logger.error(error);
    }
  }
}
