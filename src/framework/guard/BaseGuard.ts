import type { GuardException } from "@/framework/exception/GuardException";
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

export type BaseGuardTypeMap = {
  slashCommand: ChatInputCommandInteraction<"cached">;
  messageContextMenuCommand: MessageContextMenuCommandInteraction<"cached">;
  userContextMenuCommand: UserContextMenuCommandInteraction<"cached">;
  button: ButtonInteraction<"cached">;
  stringSelectMenu: StringSelectMenuInteraction<"cached">;
  channelSelectMenu: ChannelSelectMenuInteraction<"cached">;
  roleSelectMenu: RoleSelectMenuInteraction<"cached">;
  mentionableSelectMenu: MentionableSelectMenuInteraction<"cached">;
  any:
    | ChatInputCommandInteraction<"cached">
    | MessageContextMenuCommandInteraction<"cached">
    | UserContextMenuCommandInteraction<"cached">
    | ButtonInteraction<"cached">
    | StringSelectMenuInteraction<"cached">
    | ChannelSelectMenuInteraction<"cached">
    | RoleSelectMenuInteraction<"cached">
    | MentionableSelectMenuInteraction<"cached">;
};

type BaseGuardOptions<T extends keyof BaseGuardTypeMap> = {
  type: T;
};

export abstract class BaseGuard<T extends keyof BaseGuardTypeMap> {
  readonly type: T;

  constructor({ type }: BaseGuardOptions<T>) {
    this.type = type;
  }

  abstract execute(interaction: BaseGuardTypeMap[T]): unknown | GuardException;
}
