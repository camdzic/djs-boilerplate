import { BaseTrigger } from "@/framework";
import type { ButtonInteraction } from "discord.js";

export class PingTrigger extends BaseTrigger<"button"> {
  constructor() {
    super({
      id: "ping-",
      type: "button",
      startsWith: true
    });
  }

  execute(interaction: ButtonInteraction<"cached">) {
    const customId = interaction.customId.split("-")[1];

    return interaction.reply({
      content: `Button clicked: ${customId}`,
      flags: ["Ephemeral"]
    });
  }
}
