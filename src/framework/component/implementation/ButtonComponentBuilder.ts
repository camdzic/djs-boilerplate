import { container } from "@/index";
import {
  ButtonBuilder,
  type ButtonInteraction,
  SnowflakeUtil
} from "discord.js";

type ButtonComponentBuilderExecuteOptions = {
  execute: (interaction: ButtonInteraction<"cached">) => unknown;
  allowedExecutorIds?: string[];
  executionThreshold?: number;
};

export class ButtonComponentBuilder extends ButtonBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5
  }: ButtonComponentBuilderExecuteOptions) {
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    container.components.push({
      id: customId,
      type: "button",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "button" || c.id !== customId
      );
    }, executionThreshold);

    return this;
  }
}
