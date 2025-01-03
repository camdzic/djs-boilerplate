import { Container } from "@/framework";
import { GatewayIntentBits, Partials } from "discord.js";

export const container = new Container({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});
