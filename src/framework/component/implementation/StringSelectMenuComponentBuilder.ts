import { container } from "@/index";
import {
  StringSelectMenuBuilder,
  type StringSelectMenuInteraction
} from "discord.js";

type StringSelectMenuComponentBuilderExecuteOptions = {
  execute: (interaction: StringSelectMenuInteraction<"cached">) => unknown;
  allowedExecutorIds?: string[];
  executionThreshold?: number;
};

export class StringSelectMenuComponentBuilder extends StringSelectMenuBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5
  }: StringSelectMenuComponentBuilderExecuteOptions) {
    const trigger = container.triggers
      .filter(t => t.type === "stringSelectMenu")
      .find(t =>
        t.startsWith
          ? //@ts-ignore
            this.data.custom_id.startsWith(t.id)
          : //@ts-ignore
            t.id === this.data.custom_id
      );

    if (trigger) {
      container.logger.warn(
        "Two string select menu components have the same id, trigger will be used"
      );
      return this;
    }

    container.components.push({
      //@ts-ignore
      id: this.data.custom_id,
      type: "stringSelectMenu",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        //@ts-ignore
        c => c.type !== "stringSelectMenu" || c.id !== this.data.custom_id
      );
    }, executionThreshold);

    return this;
  }
}
