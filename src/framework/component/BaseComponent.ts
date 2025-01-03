import type {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction
} from "discord.js";

export type BaseComponentTypeMap = {
  button: ButtonInteraction<"cached">;
  stringSelectMenu: StringSelectMenuInteraction<"cached">;
  channelSelectMenu: ChannelSelectMenuInteraction<"cached">;
  roleSelectMenu: RoleSelectMenuInteraction<"cached">;
  mentionableSelectMenu: MentionableSelectMenuInteraction<"cached">;
  modal: ModalSubmitInteraction<"cached">;
};

export type BaseComponent<T extends keyof BaseComponentTypeMap> = {
  id: string;
  type: T;
  allowedExecutorIds: string[];
  executionThreshold: number;
  execute(interaction: BaseComponentTypeMap[T]): unknown;
};
