import { container } from "@/index";
import {
  ChannelSelectMenuBuilder,
  type ChannelSelectMenuInteraction
} from "discord.js";

type ChannelSelectMenuComponentBuilderExecuteOptions = {
  execute: (interaction: ChannelSelectMenuInteraction<"cached">) => unknown;
  allowedExecutorIds?: string[];
  executionThreshold?: number;
};

export class ChannelSelectMenuComponentBuilder extends ChannelSelectMenuBuilder {
  setExecute({
    execute,
    allowedExecutorIds = [],
    executionThreshold = 60 * 1000 * 5
  }: ChannelSelectMenuComponentBuilderExecuteOptions) {
    const trigger = container.triggers
      .filter(t => t.type === "channelSelectMenu")
      .find(t =>
        t.startsWith
          ? //@ts-ignore
            this.data.custom_id.startsWith(t.id)
          : //@ts-ignore
            t.id === this.data.custom_id
      );

    if (trigger) {
      container.logger.warn(
        "Two channel select menu components have the same id, trigger will be used"
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
      type: "channelSelectMenu",
      allowedExecutorIds,
      executionThreshold,
      execute
    });

    setTimeout(() => {
      container.components = container.components.filter(
        //@ts-ignore
        c => c.type !== "channelSelectMenu" || c.id !== this.data.custom_id
      );
    }, executionThreshold);

    return this;
  }

  generateId() {
    return Math.floor(1000 + Math.random() * 9000);
  }
}
