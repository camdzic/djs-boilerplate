import { BaseContextMenuCommand, ChannelTypeGuard } from "@/framework";
import {
  ChannelType,
  type MessageContextMenuCommandInteraction,
  MessageFlags
} from "discord.js";

export class PingContextMenuCommand extends BaseContextMenuCommand<"messageContextMenuCommand"> {
  constructor() {
    super({
      name: "Context Menu Ping",
      type: "messageContextMenuCommand",
      guards: [new ChannelTypeGuard(ChannelType.GuildText)]
    });
  }

  execute(interaction: MessageContextMenuCommandInteraction<"cached">) {
    return interaction.reply({
      content: "Pong!",
      flags: [MessageFlags.Ephemeral]
    });
  }
}
