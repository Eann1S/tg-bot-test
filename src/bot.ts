import dotenv from "dotenv";
import { Bot } from "grammy";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN as string);

bot.command("start", (ctx) => {
  ctx.reply("Welcome!");
});

bot.command("help", (ctx) =>
  ctx.reply(
    "Available commands:\n" +
      "/start - Start the bot\n" +
      "/help - Show this help message\n" +
      "/webapp - Open the Mini App"
  )
);

bot.command("webapp", (ctx) => {
  const WEBAPP_URL = process.env.WEBAPP_URL;
  if (!WEBAPP_URL) {
    ctx.reply("Webapp currently unavailable");
  } else {
    ctx.reply("Open Web App", {
      reply_markup: {
        inline_keyboard: [[{ text: "Open App", web_app: { url: WEBAPP_URL } }]],
      },
    });
  }
});



console.log("Starting bot...");
bot.start();
process.on("uncaughtException", console.error);

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
