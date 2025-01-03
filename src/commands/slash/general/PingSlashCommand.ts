import { BaseSlashCommand, ChannelTypeGuard } from "@/framework";
import { container } from "@/index";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  type ChatInputCommandInteraction,
  StringSelectMenuBuilder
} from "discord.js";

export class PingSlashCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "ping",
      description: "Pong!",
      category: "general",
      guards: [new ChannelTypeGuard(ChannelType.GuildText)]
    });
  }

  async execute(interaction: ChatInputCommandInteraction<"cached">) {
    const userEntity = await container.db.users.getOne(
      interaction.user.id,
      interaction.guild.id
    );
    console.log(userEntity);

    const allUserEntities = await container.db.users.get();
    console.log(allUserEntities);

    const updatedUserEntity = await container.db.users.update(
      interaction.user.id,
      interaction.guild.id,
      {
        messages: userEntity.messages + 1
      }
    );
    console.log(updatedUserEntity);

    await container.db.users.delete(interaction.user.id, interaction.guild.id);
    const userEntity2 = await container.db.users.getOne(
      interaction.user.id,
      interaction.guild.id
    );
    console.log(userEntity2);

    return interaction.reply({
      content: "Pong!",
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setLabel("Test")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("ping"),
          new ButtonBuilder()
            .setLabel("Test 2")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("ping-beautiful")
        ),
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setPlaceholder("Select an option")
            .setCustomId("select")
            .addOptions([
              {
                label: "Option 1",
                value: "option-1"
              },
              {
                label: "Option 2",
                value: "option-2"
              }
            ])
        )
      ]
    });
  }
}
