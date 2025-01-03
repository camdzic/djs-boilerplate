import { container } from "@/index";
import {
  ModalBuilder,
  type ModalSubmitInteraction,
  SnowflakeUtil
} from "discord.js";

type ModalComponentBuilderExecuteOptions = {
  execute: (interaction: ModalSubmitInteraction<"cached">) => unknown;
  allowedExecutorIds?: string[];
  executionThreshold?: number;
};

export class ModalComponentBuilder extends ModalBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5
  }: ModalComponentBuilderExecuteOptions) {
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    container.components.push({
      id: customId,
      type: "modal",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "modal" || c.id !== customId
      );
    }, executionThreshold);

    return this;
  }
}
