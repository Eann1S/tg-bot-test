import { Address, fromNano, HttpApi, toNano } from "ton";

export async function verifyThatTransactionExists(
  toWalletAddress: string,
  amount: number,
  comment: string
) {
  const endpoint =
    process.env.NETWORK === "mainnet"
      ? "https://toncenter.com/api/v2/jsonRPC"
      : "https://testnet.toncenter.com/api/v2/jsonRPC";

  const httpClient = new HttpApi(endpoint, {
    apiKey: process.env.TONCENTER_TOKEN,
  });

  const transactions = await httpClient.getTransactions(
    Address.parseRaw(toWalletAddress),
    {
      limit: 100,
    }
  );

  const incomingTransactions = transactions.filter(
    (tx) => Object.keys(tx.out_msgs).length === 0
  );

  for (let tx of incomingTransactions) {
    if (
      !tx.in_msg ||
      ("text" in tx.in_msg?.msg_data && !tx.in_msg.msg_data.text)
    ) {
      continue;
    }
    const txValue = fromNano(tx.in_msg.value);
    const txComment = tx.in_msg.message;
    if (txValue === amount.toString() && txComment === comment) {
      return true;
    }
  }
  return false;
}

export async function generatePaymentLink(
  toWalletAddress: string,
  amount: number,
  comment: string,
  app: "tonhub"
) {
  const nanoAmount = toNano(amount);
  switch (app) {
    case "tonhub":
      return `https://tonhub.com/transfer/${toWalletAddress}?amount=${nanoAmount}&text=${comment}`;
    default:
      return undefined;
  }
}
