import { GuardException } from "@/framework/exception/GuardException";
import { BaseGuard } from "@/framework/guard/BaseGuard";
import { container } from "@/index";
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

export class RoleGuard extends BaseGuard<"any"> {
  private readonly roleIds: string[];
  private readonly requireAllRoles: boolean;

  constructor(requireAllRoles = true, ...roleIds: string[]) {
    super({
      type: "any"
    });

    this.roleIds = roleIds;
    this.requireAllRoles = requireAllRoles;
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
    if (!interaction.member) {
      container.logger.warn("While executing RoleGuard, member was not found");
      throw new GuardException(
        "While executing RoleGuard, member was not found"
      );
    }

    const hasRoles = this.roleIds.every(roleId =>
      interaction.member.roles.cache.has(roleId)
    );

    if (this.requireAllRoles && !hasRoles) {
      throw new GuardException("You do not have the required roles");
    }

    if (!this.requireAllRoles && !hasRoles) {
      throw new GuardException("You do not have the required roles");
    }
  }
}
