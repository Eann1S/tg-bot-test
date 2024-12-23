import dotenv from "dotenv";
import { Bot, GrammyError, HttpError } from "grammy";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN as string);

async function main() {
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
          inline_keyboard: [
            [{ text: "Open App", web_app: { url: WEBAPP_URL } }],
          ],
        },
      });
    }
  });

  await bot.api.setMyCommands([
    {
      command: "start",
      description: "Start the bot",
    },
    {
      command: "help",
      description: "Get some help",
    },
    {
      command: "webapp",
      description: "Open the Mini App",
    },
  ]);

  console.log("Starting bot...");
  await bot.start();
}

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e)
  } else {
    console.error("Unknown error:", e)
  }
})

process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());

main();
