import { InlineKeyboard } from "grammy";
import { CustomContext } from "../bot";
import { verifyThatTransactionExists } from "../services/ton";

export default async function checkTransaction(ctx: CustomContext) {
  await ctx.answerCallbackQuery({
    text: "Wait a bit, I need to check that transaction is successfully completed",
  });
  const transactionExists = await verifyThatTransactionExists(
    process.env.OWNER_WALLET as string,
    ctx.session.amount,
    ctx.session.comment
  );
  if (transactionExists) {
    const menu = new InlineKeyboard().text("Done! Buy more :)", "buy");

    await ctx.reply("Thank you so much!", { reply_markup: menu });

    ctx.session.amount = 0;
    ctx.session.comment = "";
  } else {
    await ctx.reply("I didn't receive any transaction yet, wait a bit");
  }
}
