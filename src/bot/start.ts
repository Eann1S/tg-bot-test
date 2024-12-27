import { InlineKeyboard } from "grammy";
import { CustomContext } from "../bot";

export default async function handleStart(ctx: CustomContext) {
  const menu = new InlineKeyboard().text("Buy something :)", "buy").row();

  await ctx.reply(
    `Hello!\n Welcome to this telegram bot`,
    { reply_markup: menu, parse_mode: "Markdown" }
  );
}
