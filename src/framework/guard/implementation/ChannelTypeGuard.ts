import { GuardException } from "@/framework/exception/GuardException";
import { BaseGuard } from "@/framework/guard/BaseGuard";
import { container } from "@/index";
import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChannelType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction
} from "discord.js";

export class ChannelTypeGuard extends BaseGuard<"any"> {
  private readonly channelTypes: ChannelType[];

  constructor(...channelTypes: ChannelType[]) {
    super({
      type: "any"
    });

    this.channelTypes = channelTypes;
  }

  execute(
    interaction:
      | ChatInputCommandInteraction<"cached">
      | MessageContextMenuCommandInteraction<"cached">
      | UserContextMenuCommandInteraction<"cached">
      | ButtonInteraction<"cached">
      | AnySelectMenuInteraction<"cached">
      | ModalSubmitInteraction<"cached">
  ) {
    if (!interaction.channel) {
      container.logger.warn(
        "While executing ChannelTypeGuard, channel was not found"
      );
      return;
    }

    if (!this.channelTypes.includes(interaction.channel.type)) {
      throw new GuardException("Invalid channel type");
    }
  }
}
