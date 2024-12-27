import { Conversation } from "@grammyjs/conversations";
import { CustomContext } from "../bot";
import { generatePaymentLink } from "../services/ton";
import { InlineKeyboard } from "grammy";

export default async function handlePayment(
  conversation: Conversation<CustomContext>,
  ctx: CustomContext
) {
  await ctx.answerCallbackQuery();
  await ctx.reply("Please enter number from 1 to 10");

  const number = await conversation.form.number(
    async (ctx) => await ctx.reply("Send a number from 1 to 10")
  );

  const random = Math.floor(Math.random() * number);
  const comment = Math.random().toString(36).substring(2, 8);

  conversation.session.amount = random;
  conversation.session.comment = comment;

  const tonhubPaymentLink = await generatePaymentLink(
    process.env.OWNER_WALLET as string,
    random,
    comment,
    "tonkeeper"
  );

  const menu = new InlineKeyboard()
    .url("Click to pay in Tonhub", tonhubPaymentLink)
    .row()
    .text(`I sent ${random} TON`, "checkTransaction");

  await ctx.reply(
    `
    All you have to do, is to send ${random} TON to the wallet <code>${process.env.OWNER_WALLET}</code> with the comment <code>${comment}</code>
    You can conveniently make a transfer by clicking the button below
    `,
    { reply_markup: menu, parse_mode: "HTML" }
  );
}
