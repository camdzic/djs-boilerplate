import { container } from "@/index";
import {
  RoleSelectMenuBuilder,
  type RoleSelectMenuInteraction
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
    const trigger = container.triggers
      .filter(t => t.type === "roleSelectMenu")
      .find(t =>
        t.startsWith
          ? //@ts-ignore
            this.data.custom_id.startsWith(t.id)
          : //@ts-ignore
            t.id === this.data.custom_id
      );

    if (trigger) {
      container.logger.warn(
        "Two role select menu components have the same id, trigger will be used"
      );
      return this;
    }

    container.components.push({
      //@ts-ignore
      id: this.data.custom_id,
      type: "roleSelectMenu",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        //@ts-ignore
        c => c.type !== "roleSelectMenu" || c.id !== this.data.custom_id
      );
    }, executionThreshold);

    return this;
  }
}