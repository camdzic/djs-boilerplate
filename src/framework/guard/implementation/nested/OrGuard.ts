import { GuardException } from "@/framework/exception/GuardException";
import { BaseGuard, type BaseGuardTypeMap } from "@/framework/guard/BaseGuard";
import type {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ChatInputCommandInteraction,
  MentionableSelectMenuInteraction,
  MessageContextMenuCommandInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserContextMenuCommandInteraction
} from "discord.js";

export class OrGuard extends BaseGuard<"any"> {
  private readonly guards: BaseGuard<keyof BaseGuardTypeMap>[];

  constructor(...guards: BaseGuard<keyof BaseGuardTypeMap>[]) {
    super({
      type: "any"
    });

    this.guards = guards;
  }

  execute(
    interaction:
      | ChatInputCommandInteraction<"cached">
      | MessageContextMenuCommandInteraction<"cached">
      | UserContextMenuCommandInteraction<"cached">
      | ButtonInteraction<"cached">
      | StringSelectMenuInteraction<"cached">
      | ChannelSelectMenuInteraction<"cached">
      | RoleSelectMenuInteraction<"cached">
      | MentionableSelectMenuInteraction<"cached">
  ) {
    const allowedGuards = this.guards.filter(g =>
      this.isSpecificGuard(g, this.getInteractionType(interaction))
    );

    const results = allowedGuards.map(async guard => {
      try {
        await guard.execute(interaction);
        return true;
      } catch {
        return false;
      }
    });

    if (results.length && !results.some(result => result)) {
      throw new GuardException("None of the guards in OrGuard passed");
    }
  }

  private isSpecificGuard(
    guard: BaseGuard<keyof BaseGuardTypeMap>,
    type: keyof BaseGuardTypeMap
  ): guard is BaseGuard<typeof type> | BaseGuard<"any"> {
    return guard.type === type || guard.type === "any";
  }

  private getInteractionType(
    interaction:
      | ChatInputCommandInteraction<"cached">
      | MessageContextMenuCommandInteraction<"cached">
      | UserContextMenuCommandInteraction<"cached">
      | ButtonInteraction<"cached">
      | StringSelectMenuInteraction<"cached">
      | ChannelSelectMenuInteraction<"cached">
      | RoleSelectMenuInteraction<"cached">
      | MentionableSelectMenuInteraction<"cached">
  ): keyof BaseGuardTypeMap {
    if (interaction.isChatInputCommand()) return "slashCommand";
    if (interaction.isMessageContextMenuCommand())
      return "messageContextMenuCommand";
    if (interaction.isUserContextMenuCommand()) return "userContextMenuCommand";
    if (interaction.isButton()) return "button";
    if (interaction.isStringSelectMenu()) return "stringSelectMenu";
    if (interaction.isChannelSelectMenu()) return "channelSelectMenu";
    if (interaction.isRoleSelectMenu()) return "roleSelectMenu";
    if (interaction.isMentionableSelectMenu()) return "mentionableSelectMenu";

    throw new Error("Unknown interaction type");
  }
}
