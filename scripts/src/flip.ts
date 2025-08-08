import { suiClient, keyPair, log } from './utils';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID =
  '0x81d946aac21c23f5b59fd6913d0336fe515aaa080668a19750163e2b9f76479c';

const HOUSE_ID =
  '0x0a6e376317d2b4782101995e2118c112f8d7c0b36c8147685eca1bd8ad21cd29';

(async () => {
  const tx = new Transaction();

  const suiCoin = tx.splitCoins(tx.gas, [tx.pure.u64(500_000_000)]);

  tx.setSender(keyPair.toSuiAddress());

  tx.moveCall({
    package: PACKAGE_ID,
    module: 'coin_flip',
    function: 'flip',
    typeArguments: [],
    arguments: [tx.object(HOUSE_ID), tx.object.random(), suiCoin],
  });

  const result = await keyPair.signAndExecuteTransaction({
    transaction: tx,
    client: suiClient,
  });

  log(result);
})();
