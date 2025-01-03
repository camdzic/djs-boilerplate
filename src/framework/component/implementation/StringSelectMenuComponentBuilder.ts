import { container } from "@/index";
import {
  SnowflakeUtil,
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
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    container.components.push({
      id: customId,
      type: "stringSelectMenu",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "stringSelectMenu" || c.id !== customId
      );
    }, executionThreshold);

    return this;
  }
}
