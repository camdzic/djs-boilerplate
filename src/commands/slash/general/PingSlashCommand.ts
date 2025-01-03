import { BaseSlashCommand, ChannelTypeGuard } from "@/framework";
import { ChannelType, MessageFlags, type ChatInputCommandInteraction } from "discord.js";

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
      flags: [MessageFlags.Ephemeral]
    });
  }
}
