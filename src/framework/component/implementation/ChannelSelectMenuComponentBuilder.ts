import { container } from "@/index";
import {
  ChannelSelectMenuBuilder,
  type ChannelSelectMenuInteraction,
  SnowflakeUtil
} from "discord.js";

type ChannelSelectMenuComponentBuilderExecuteOptions = {
  execute: (interaction: ChannelSelectMenuInteraction<"cached">) => unknown;
  allowedExecutorIds?: string[];
  executionThreshold?: number;
  disposeOnInteract?: boolean;
  renewOnInteract?: boolean;
};

export class ChannelSelectMenuComponentBuilder extends ChannelSelectMenuBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5,
    disposeOnInteract = false,
    renewOnInteract = false
  }: ChannelSelectMenuComponentBuilderExecuteOptions) {
    const customId = SnowflakeUtil.generate().toString();

    this.setCustomId(customId);

    const timeout = setTimeout(() => {
      container.components = container.components.filter(
        c => c.type !== "channelSelectMenu" || c.id !== customId
      );
    }, executionThreshold);

    container.components.push({
      id: customId,
      type: "channelSelectMenu",
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
