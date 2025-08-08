import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import util from 'util';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export const log = (x: any) => console.log(util.inspect(x, false, null, true));
import dotenv from 'dotenv';

dotenv.config();

export const keyPair = Ed25519Keypair.fromSecretKey(
  Uint8Array.from(Buffer.from(process.env.KEY!, 'base64')).slice(1)
);

export const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet'),
});
