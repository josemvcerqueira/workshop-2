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

export const PACKAGE_ID = '';

export const HOUSE_ID = '';

export const executeTransaction = async (transaction, senderSig) => {};

app.post('/sponsorTx', async (req, res, next) => {
  try {
    res.json({
      txBytes: '',
      sponsorSig: '', // not needed by FE when BE submits, but easy to pass back and forth
    });
  } catch (err) {
    next(err);
  }
});

app.post('/executeSponsoredTx', async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

app.listen(8080, () => {
  console.log('Backend running on port 8080');
});
