import { container } from "@/index";
import {
  ModalBuilder,
  type ModalSubmitInteraction,
  SnowflakeUtil
} from "discord.js";

type ModalComponentBuilderExecuteOptions = {
  execute: (interaction: ModalSubmitInteraction<"cached">) => unknown;
  executionThreshold?: number;
};

export class ModalComponentBuilder extends ModalBuilder {
  setExecute({
    execute,
    executionThreshold = 60 * 1000 * 5
  }: ModalComponentBuilderExecuteOptions) {
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    const timeout = setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "modal" || c.id !== customId
      );
    }, executionThreshold);

    container.components.push({
      id: customId,
      type: "modal",
      allowedExecutorIds: [],
      executionThreshold,
      disposeOnInteract: false,
      renewOnInteract: false,
      timeout,
      execute
    });

    return this;
  }
}
