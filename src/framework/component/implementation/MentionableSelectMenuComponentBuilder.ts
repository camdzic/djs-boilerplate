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
  disposeOnInteract?: boolean;
  renewOnInteract?: boolean;
};

export class MentionableSelectMenuComponentBuilder extends MentionableSelectMenuBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5,
    disposeOnInteract = false,
    renewOnInteract = false
  }: MentionableSelectMenuComponentBuilderExecuteOptions) {
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    const timeout = setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "mentionableSelectMenu" || c.id !== customId
      );
    }, executionThreshold);

    container.components.push({
      id: customId,
      type: "mentionableSelectMenu",
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
