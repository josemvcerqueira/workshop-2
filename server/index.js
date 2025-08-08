import { GasStationClient, createSuiClient } from '@shinami/clients/sui';

// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const nodeClient = createSuiClient(process.env.KEY);
const gasClient = new GasStationClient(process.env.KEY);

export const executeTransaction = async (transaction, senderSig) => {};

app.post('/sponsorTx', async (req, res, next) => {
  try {
    const sponsorTx = await gasClient.sponsorTransaction(req.body.txBytes);

    console.log(sponsorTx);

    res.json({
      txBytes: sponsorTx.txBytes,
      sponsorSig: sponsorTx.signature,
    });
  } catch (err) {
    next(err);
  }
});

app.post('/executeSponsoredTx', async (req, res, next) => {
  try {
    const result = await nodeClient.executeTransactionBlock({
      transactionBlock: req.body.txBytes,
      signature: req.body.signature,
      options: {
        showEvents: true,
      },
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

app.listen(8080, () => {
  console.log('Backend running on port 8080');
});
