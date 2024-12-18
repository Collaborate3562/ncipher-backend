const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const WhaleTransaction = require('../models/BSCWhaleTransaction');
const { getWhaleAccounts } = require('../services/BitqueryService');

let activeCronJob = null;
let delayedMins = 0;

const getWhaleAccountsWithLogging = async () => {
  try {
    setTimeout(() => {
      console.log('Running getWhaleAccounts');
      getWhaleAccounts();
    }, delayedMins * 60 * 1000)
  } catch (error) {
    console.error('Error in getWhaleAccounts:', error);
  }
}

// Function to start a synchronized cron job
const startCronJob = (interval) => {
  // Stop any existing cron job
  if (activeCronJob) {
    activeCronJob.stop();
    activeCronJob = null;
    delayedMins = 0;
  }

  const seconds = new Date().getSeconds(); // Get exact seconds from startTime
  const minutes = new Date().getMinutes(); // Get exact minutes from startTime
  delayedMins = minutes % interval; // Calculate the delay in minutes

  console.log(`Seconds: ${seconds}, Minutes: ${minutes}, DelayedMins: ${delayedMins}`);

  const cronExpression = `${seconds} */${interval} * * * *`; // Dynamic cron expression

  console.log(`Starting cron job with expression: ${cronExpression}`);
  activeCronJob = cron.schedule(cronExpression, getWhaleAccountsWithLogging);
};

router.post('/whale-tracker-interval', (req, res) => {
  const { interval } = req.body;

  startCronJob(interval);
  res.sendStatus(200);
});

router.get('/whale-transactions', async (req, res) => {
  try {
    const transactions = await WhaleTransaction.find().sort({ amount: -1 }).limit(10);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch whale transactions' });
  }
});

module.exports = router;