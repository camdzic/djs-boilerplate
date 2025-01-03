import { GuardException } from "@/framework/exception/GuardException";
import { BaseGuard } from "@/framework/guard/BaseGuard";
import { container } from "@/index";
import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
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
      | AnySelectMenuInteraction<"cached">
      | ModalSubmitInteraction<"cached">
  ) {
    if (!interaction.member) {
      container.logger.warn("While executing RoleGuard, member was not found");
      return;
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
