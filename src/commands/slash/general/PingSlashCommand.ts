import { BaseSlashCommand, ChannelTypeGuard } from "@/framework";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  type ChatInputCommandInteraction,
  StringSelectMenuBuilder
} from "discord.js";

export class PingSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "ping",
      description: "Pong!",
      category: "general",
      guards: [new ChannelTypeGuard(ChannelType.GuildText)]
    });
  }

  execute(interaction: ChatInputCommandInteraction<"cached">) {
    interaction.reply({
      content: "Pong!",
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setLabel("Test")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ping"),
          new ButtonBuilder()
            .setLabel("Test 2")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("ping-beautiful")
        ),
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setPlaceholder("Select an option")
            .setCustomId("select")
            .addOptions([
              {
                label: "Option 1",
                value: "option-1"
              },
              {
                label: "Option 2",
                value: "option-2"
              }
            ])
        )
      ]
    });
  }
}
