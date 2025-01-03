import type { BaseGuard, BaseGuardTypeMap } from "@/framework/guard/BaseGuard";
import type {
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from "discord.js";

export type BaseContextMenuCommandTypeMap = {
  messageContextMenuCommand: MessageContextMenuCommandInteraction<"cached">;
  userContextMenuCommand: UserContextMenuCommandInteraction<"cached">;
};

type BaseContextMenuCommandOptions<
  T extends keyof BaseContextMenuCommandTypeMap
> = {
  name: string;
  type: T;
  guards?: BaseGuard<keyof BaseGuardTypeMap>[];
};

export abstract class BaseContextMenuCommand<
  T extends keyof BaseContextMenuCommandTypeMap
> {
  readonly name: string;
  readonly type: T;
  readonly guards?: BaseGuard<keyof BaseGuardTypeMap>[] = [];

  constructor({ name, type, guards }: BaseContextMenuCommandOptions<T>) {
    this.name = name;
    this.type = type;
    this.guards = guards;
  }

  abstract execute(interaction: BaseContextMenuCommandTypeMap[T]): unknown;
}
