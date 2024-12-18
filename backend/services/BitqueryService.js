const axios = require('axios');
const WhaleTransaction = require('../models/BSCWhaleTransaction');

const { BITQUERY_API_KEY, BITQUERY_API_URL } = process.env;

const getWhaleAccounts = async () => {
  const query = `
    {
      EVM(network: bsc) {
        Transactions(
          limit: {count: 10}
          orderBy: {descending: Block_Date}
          where: {Transaction: {Value: {gt: "1000"}}, TransactionStatus: {Success: true}}
        ) {
          Transaction {
            From
            To
            Hash
            Value
            ValueInUSD
          }
          Block {
            Number
            Date
          }
        }
      }
    }
  `;

  const response = await axios.post(BITQUERY_API_URL, {
    query,
  }, {
    headers: {
      'X-API-KEY': BITQUERY_API_KEY,
    },
  });

  const transactions = response.data.data.EVM.Transactions;

  for (const transaction of transactions) {
    const existingTransaction = await WhaleTransaction.findOne({ transactionHash: transaction.Transaction.Hash });

    if (!existingTransaction) {
      const newTransaction = new WhaleTransaction({
        from: transaction.Transaction.From,
        to: transaction.Transaction.To,
        amount: transaction.Transaction.Value,
        transactionHash: transaction.Transaction.Hash,
        valueInUSD: transaction.Transaction.ValueInUSD,
        blockHeight: transaction.Block.Number
      });

      await newTransaction.save();
    }
  }

  return transactions;
};

module.exports = { getWhaleAccounts };