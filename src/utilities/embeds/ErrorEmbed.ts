import { container } from "@/index";
import { type ColorResolvable, EmbedBuilder, bold } from "discord.js";

export class ErrorEmbed extends EmbedBuilder {
  constructor(message: string) {
    super();

    this.setColor(
      container.settings.getString("colors.error") as ColorResolvable
    );
    this.setDescription(bold(message));
  }
}
