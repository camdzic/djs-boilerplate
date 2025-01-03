import type { BaseGuard, BaseGuardTypeMap } from "@/framework/guard/BaseGuard";
import type {
  ApplicationCommandOptionData,
  ChatInputCommandInteraction,
  PermissionResolvable
} from "discord.js";

type BaseSlashCommandOptions = {
  name: string;
  description: string;
  category: string;
  options?: ApplicationCommandOptionData[];
  guards?: BaseGuard<keyof BaseGuardTypeMap>[];
  permissions?: PermissionResolvable[];
};

export abstract class BaseSlashCommand {
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly options?: ApplicationCommandOptionData[] = [];
  readonly guards?: BaseGuard<keyof BaseGuardTypeMap>[] = [];
  readonly permissions?: PermissionResolvable[] = [];

  constructor({
    name,
    description,
    category,
    options,
    guards,
    permissions
  }: BaseSlashCommandOptions) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.options = options;
    this.guards = guards;
    this.permissions = permissions;
  }

  abstract execute(interaction: ChatInputCommandInteraction<"cached">): unknown;
}
