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
  disposeOnInteract?: boolean;
  renewOnInteract?: boolean;
};

export class RoleSelectMenuComponentBuilder extends RoleSelectMenuBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5,
    disposeOnInteract = false,
    renewOnInteract = false
  }: RoleSelectMenuComponentBuilderExecuteOptions) {
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    const timeout = setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "roleSelectMenu" || c.id !== customId
      );
    }, executionThreshold);

    container.components.push({
      id: customId,
      type: "roleSelectMenu",
      allowedExecutorIds,
      executionThreshold,
      disposeOnInteract,
      renewOnInteract,
      timeout,
      execute
    });

    return this;
  }
}
