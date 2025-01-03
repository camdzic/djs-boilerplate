import { BaseTrigger } from "@/framework";
import type { StringSelectMenuInteraction } from "discord.js";

export class PingTrigger extends BaseTrigger<"stringSelectMenu"> {
  constructor() {
    super({
      id: "select",
      type: "stringSelectMenu"
    });
  }

  execute(interaction: StringSelectMenuInteraction<"cached">) {
    return interaction.reply({
      content: `Select menu clicked: ${interaction.customId}`,
      flags: ["Ephemeral"]
    });
  }
}
