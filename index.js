const { Client, IntentsBitField, Partials } = require("discord.js");
const client = new Client({
  intents: [IntentsBitField.Flags.GuildMessages],
  partials: [Partials.Message],
});
const axios = require("axios");
require("dotenv").config();

client.on("messageCreate", (message) => {
  if (message.member.permissions.has("ManageMessages")) return;
  if (message.attachments.size < 1) return;
  for (let i = 0; i < message.attachments.size; i++) {
    const url = message.attachments.at(i).url;
    axios
      .get(`https://api.sightengine.com/1.0/check.json`, {
        params: {
          url: url,
          models: "genai",
          api_user: process.env.api_user,
          api_secret: process.env.api_secret,
        },
      })
      .then(({ data }) => {
        console.log({ data });
        if (data.type.ai_generated > 0.6) {
          console.log(`Art sent by ${message.author.displayName} is AI`);
          message.delete();
        } else
          console.log(`Art sent by ${message.author.displayName} is not AI`);
      })
      .catch((error) => {
        if (error.response) console.log(error.response.data);
        else console.log(error.message);
      });
  }
});

client.once("ready", () => {
  console.log(`${client.user.displayName} is online`);
});

client.login(process.env.discord_token);
