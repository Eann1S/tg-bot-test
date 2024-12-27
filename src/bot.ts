import { ConversationFlavor, conversations, createConversation } from "@grammyjs/conversations";
import dotenv from "dotenv";
import {
  Bot,
  Context,
  GrammyError,
  HttpError,
  session,
  SessionFlavor,
} from "grammy";
import handleStart from "./bot/start";
import handlePayment from "./bot/payment";
import checkTransaction from "./bot/check.transaction";

dotenv.config();

type SessionData = {
  amount: number;
  comment: string;
};

export type CustomContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor;

const bot = new Bot<CustomContext>(process.env.BOT_TOKEN as string);

bot.use(session({ initial: () => ({ amount: 0, comment: "" }) }));
bot.use(conversations());
bot.use(createConversation(handlePayment))

export async function main() {
  bot.command("start", handleStart);
  bot.callbackQuery(
    "buy",
    async (ctx) => await ctx.conversation.enter("handlePayment")
  );
  bot.callbackQuery("checkTransaction", checkTransaction)

  bot.command(
    "help",
    async (ctx) =>
      await ctx.reply(
        "Available commands:\n" +
          "/start - Start the bot\n" +
          "/help - Show this help message\n" +
          "/webapp - Open the Mini App"
      )
  );

  bot.command("webapp", async (ctx) => {
    const WEBAPP_URL = process.env.WEBAPP_URL;
    if (!WEBAPP_URL) {
      await ctx.reply("Webapp currently unavailable");
    } else {
      await ctx.reply("Open Web App", {
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

  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });

  process.once("SIGINT", () => bot.stop());
  process.once("SIGTERM", () => bot.stop());

  console.log("Starting bot...");
  await bot.start();
}

main();
