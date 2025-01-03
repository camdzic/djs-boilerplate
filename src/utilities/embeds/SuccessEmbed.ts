import { container } from "@/index";
import { type ColorResolvable, EmbedBuilder, bold } from "discord.js";

export class SuccessEmbed extends EmbedBuilder {
  constructor(message: string) {
    super();

    this.setColor(
      container.settings.getString("colors.success") as ColorResolvable
    );
    this.setDescription(bold(message));
  }
}
