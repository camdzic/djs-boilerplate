import { container } from "@/index";
import {
  MentionableSelectMenuBuilder,
  type MentionableSelectMenuInteraction,
  SnowflakeUtil
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
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    container.components.push({
      id: customId,
      type: "mentionableSelectMenu",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "mentionableSelectMenu" || c.id !== customId
      );
    }, executionThreshold);

    return this;
  }
}
