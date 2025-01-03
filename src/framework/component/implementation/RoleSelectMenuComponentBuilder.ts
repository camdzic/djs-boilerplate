import { container } from "@/index";
import {
  RoleSelectMenuBuilder,
  type RoleSelectMenuInteraction,
  SnowflakeUtil
} from "discord.js";

type RoleSelectMenuComponentBuilderExecuteOptions = {
  execute: (interaction: RoleSelectMenuInteraction<"cached">) => unknown;
  allowedExecutorIds?: string[];
  executionThreshold?: number;
};

export class RoleSelectMenuComponentBuilder extends RoleSelectMenuBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5
  }: RoleSelectMenuComponentBuilderExecuteOptions) {
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    container.components.push({
      id: customId,
      type: "roleSelectMenu",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "roleSelectMenu" || c.id !== customId
      );
    }, executionThreshold);

    return this;
  }
}
