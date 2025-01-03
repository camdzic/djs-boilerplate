import { container } from "@/index";
import { ButtonBuilder, type ButtonInteraction } from "discord.js";

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
    const trigger = container.triggers
      .filter(t => t.type === "button")
      .find(t =>
        t.startsWith
          ? //@ts-ignore
            this.data.custom_id.startsWith(t.id)
          : //@ts-ignore
            t.id === this.data.custom_id
      );

    if (trigger) {
      container.logger.warn(
        "Two button components have the same id, trigger will be used"
      );
      return this;
    }

    this.setCustomId(
      //@ts-ignore
      `${this.data.custom_id}#${this.generateId()}`
    );

    container.components.push({
      //@ts-ignore
      id: this.data.custom_id,
      type: "button",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        //@ts-ignore
        c => c.type !== "button" || c.id !== this.data.custom_id
      );
    }, executionThreshold);

    return this;
  }

  generateId() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
