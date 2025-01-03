import { BaseContextMenuCommand, RoleGuard } from "@/framework";
import type { MessageContextMenuCommandInteraction } from "discord.js";

export class PingContextMenuCommand extends BaseContextMenuCommand<"messageContextMenuCommand"> {
  constructor() {
    super({
      name: "Context Menu Ping",
      type: "messageContextMenuCommand",
      guards: [new RoleGuard(true, "1324435368807764029")]
    });
  }

  execute(interaction: MessageContextMenuCommandInteraction<"cached">) {
    interaction.reply({
      content: "Pong!",
      flags: ["Ephemeral"]
    });
  }
}
