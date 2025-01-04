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
  disposeOnInteract?: boolean;
  renewOnInteract?: boolean;
};

export class ButtonComponentBuilder extends ButtonBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5,
    disposeOnInteract = false,
    renewOnInteract = false
  }: ButtonComponentBuilderExecuteOptions) {
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    const timeout = setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "button" || c.id !== customId
      );
    }, executionThreshold);

    container.components.push({
      id: customId,
      type: "button",
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
