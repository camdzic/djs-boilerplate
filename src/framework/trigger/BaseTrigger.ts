import type { BaseGuard, BaseGuardTypeMap } from "@/framework/guard/BaseGuard";
import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction
} from "discord.js";

export type BaseTriggerTypeMap = {
  button: ButtonInteraction<"cached">;
  anySelectMenu: AnySelectMenuInteraction<"cached">;
  stringSelectMenu: StringSelectMenuInteraction<"cached">;
  channelSelectMenu: ChannelSelectMenuInteraction<"cached">;
  roleSelectMenu: RoleSelectMenuInteraction<"cached">;
  mentionableSelectMenu: MentionableSelectMenuInteraction<"cached">;
  modal: ModalSubmitInteraction<"cached">;
};

type BaseTriggerOptions<T extends keyof BaseTriggerTypeMap> = {
  id: string;
  type: T;
  startsWith?: boolean;
  guards?: BaseGuard<keyof BaseGuardTypeMap>[];
};

export abstract class BaseTrigger<T extends keyof BaseTriggerTypeMap> {
  readonly id: string;
  readonly type: T;
  readonly startsWith: boolean;
  readonly guards?: BaseGuard<keyof BaseGuardTypeMap>[] = [];

  constructor({ id, type, startsWith = false, guards }: BaseTriggerOptions<T>) {
    this.id = id;
    this.type = type;
    this.startsWith = startsWith;
    this.guards = guards;
  }

  abstract execute(interaction: BaseTriggerTypeMap[T]): unknown;
}
