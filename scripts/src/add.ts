import { suiClient, keyPair, log } from './utils';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID =
  '0x81d946aac21c23f5b59fd6913d0336fe515aaa080668a19750163e2b9f76479c';

const HOUSE_ID =
  '0x0a6e376317d2b4782101995e2118c112f8d7c0b36c8147685eca1bd8ad21cd29';

const POW_9 = 1_000_000_000;

(async () => {
  const tx = new Transaction();

  const suiCoin = tx.splitCoins(tx.gas, [tx.pure.u64(5 * POW_9)]);

  tx.setSender(keyPair.toSuiAddress());

  tx.moveCall({
    package: PACKAGE_ID,
    module: 'coin_flip',
    function: 'add',
    typeArguments: [],
    arguments: [
      tx.sharedObjectRef({
        objectId: HOUSE_ID,
        mutable: true,
        initialSharedVersion: 124020199,
      }),
      suiCoin,
    ],
  });

  const result = await keyPair.signAndExecuteTransaction({
    transaction: tx,
    client: suiClient,
  });

  log(result);
})();
