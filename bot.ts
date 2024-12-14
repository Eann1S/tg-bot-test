import dotenv from "dotenv";
import { Telegraf } from "telegraf";

dotenv.config();

const bot = new Telegraf(process.env.API_TOKEN as string);

bot.start((ctx) => ctx.reply("Welcome!"));

bot.help((ctx) =>
  ctx.reply(
    "Available commands:\n" +
      "/start - Start the bot\n" +
      "/help - Show this help message\n" +
      "/webapp - Open the Mini App"
  )
);

bot.command("webapp", (ctx) => {
  ctx.reply("Open Web App", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Open App", web_app: { url: process.env.WEBAPP_URL || "" } }],
      ],
    },
  });
});

bot
  .launch()
  .then(() => console.log("Bot started..."))
  .catch(console.error);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
