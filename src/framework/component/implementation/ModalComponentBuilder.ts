import { container } from "@/index";
import { ModalBuilder, type ModalSubmitInteraction } from "discord.js";

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
    container.components.push({
      //@ts-ignore
      id: this.data.custom_id,
      type: "modal",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        //@ts-ignore
        c => c.type !== "modal" || c.id !== this.data.custom_id
      );
    }, executionThreshold);

    return this;
  }
}