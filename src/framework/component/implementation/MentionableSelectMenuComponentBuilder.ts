import { container } from "@/index";
import {
  MentionableSelectMenuBuilder,
  type MentionableSelectMenuInteraction
} from "discord.js";

type MentionableSelectMenuComponentBuilderExecuteOptions = {
  execute: (interaction: MentionableSelectMenuInteraction<"cached">) => unknown;
  allowedExecutorIds?: string[];
  executionThreshold?: number;
};

export class MentionableSelectMenuComponentBuilder extends MentionableSelectMenuBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5
  }: MentionableSelectMenuComponentBuilderExecuteOptions) {
    const trigger = container.triggers
      .filter(t => t.type === "mentionableSelectMenu")
      .find(t =>
        t.startsWith
          ? //@ts-ignore
            this.data.custom_id.startsWith(t.id)
          : //@ts-ignore
            t.id === this.data.custom_id
      );

    if (trigger) {
      container.logger.warn(
        "Two mentionable select menu components have the same id, trigger will be used"
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
      type: "mentionableSelectMenu",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        //@ts-ignore
        c => c.type !== "mentionableSelectMenu" || c.id !== this.data.custom_id
      );
    }, executionThreshold);

    return this;
  }

  generateId() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
