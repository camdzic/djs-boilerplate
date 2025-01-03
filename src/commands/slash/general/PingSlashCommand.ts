import {
  BaseSlashCommand,
  ButtonComponentBuilder,
  ChannelTypeGuard
} from "@/framework";
import { randomUUIDv7 } from "bun";
import {
  ActionRowBuilder,
  ButtonStyle,
  ChannelType,
  type ChatInputCommandInteraction,
  MessageFlags
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
    return interaction.reply({
      content: "Pong!",
      components: [
        new ActionRowBuilder<ButtonComponentBuilder>().setComponents(
          new ButtonComponentBuilder()
            .setLabel("Test")
            .setStyle(ButtonStyle.Primary)
            .setExecute({
              execute: i => {
                return i.reply({
                  content: `Test! ${randomUUIDv7()}`,
                  flags: [MessageFlags.Ephemeral]
                });
              },
              executionThreshold: 10000
            }),
          new ButtonComponentBuilder()
            .setLabel("Test 2")
            .setStyle(ButtonStyle.Primary)
            .setExecute({
              execute: i => {
                return i.reply({
                  content: `Test 2! ${randomUUIDv7()}`,
                  flags: [MessageFlags.Ephemeral]
                });
              },
              allowedExecutorIds: [interaction.user.id]
            })
        )
      ]
    });
  }
}
