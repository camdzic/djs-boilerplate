import type { GuardException } from "@/framework/exception/GuardException";
import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ChatInputCommandInteraction,
  MentionableSelectMenuInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserContextMenuCommandInteraction
} from "discord.js";

export type BaseGuardTypeMap = {
  slashCommand: ChatInputCommandInteraction<"cached">;
  messageContextMenuCommand: MessageContextMenuCommandInteraction<"cached">;
  userContextMenuCommand: UserContextMenuCommandInteraction<"cached">;
  button: ButtonInteraction<"cached">;
  anySelectMenu: AnySelectMenuInteraction<"cached">;
  stringSelectMenu: StringSelectMenuInteraction<"cached">;
  channelSelectMenu: ChannelSelectMenuInteraction<"cached">;
  roleSelectMenu: RoleSelectMenuInteraction<"cached">;
  mentionableSelectMenu: MentionableSelectMenuInteraction<"cached">;
  modal: ModalSubmitInteraction<"cached">;
  any:
    | ChatInputCommandInteraction<"cached">
    | MessageContextMenuCommandInteraction<"cached">
    | UserContextMenuCommandInteraction<"cached">
    | ButtonInteraction<"cached">
    | AnySelectMenuInteraction<"cached">
    | StringSelectMenuInteraction<"cached">
    | ChannelSelectMenuInteraction<"cached">
    | RoleSelectMenuInteraction<"cached">
    | MentionableSelectMenuInteraction<"cached">
    | ModalSubmitInteraction<"cached">;
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
