import { useCurrentAccount, useSignTransaction } from "@mysten/dapp-kit";
import { Container, Flex, Heading, TextField, Button } from "@radix-ui/themes";
import toast from "react-hot-toast";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, HOUSE_ID } from "../constants";
import { useState } from "react";
import { suiClient } from "../networkConfig";
import { formatSui } from "../utils";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import invariant from "tiny-invariant";
import { buildGaslessTransaction } from "@shinami/clients/sui";

interface FlipEvent {
  result: boolean;
  amount_in: string;
  amount_out: string;
  fee: string;
}

const POW_9 = 10 ** 9;

export function Flip() {
  const [deposit, setDeposit] = useState<number>(0);
  const account = useCurrentAccount();
  const { mutateAsync: signTransaction } = useSignTransaction();

  const executeFlip = async () => {
    try {
      const tx = new Transaction();

      invariant(account, "Account not found");
      invariant(+deposit > 0, "Deposit must be greater than 0");

      tx.setSender(account.address);

      const suiCoin = tx.splitCoins(tx.gas, [tx.pure.u64(deposit * POW_9)]);

      tx.moveCall({
        package: PACKAGE_ID,
        module: "coin_flip",
        function: "flip",
        typeArguments: [],
        arguments: [tx.object(HOUSE_ID), tx.object.random(), suiCoin],
      });

      const { bytes, signature } = await signTransaction({
        transaction: tx,
      });

      const result = await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showEvents: true,
        },
      });

      const content = result.events?.[0]?.parsedJson as FlipEvent;

      invariant(content, "Content not found");

      const flipResult = content.result;

      toast.success(
        `Flip Result: ${flipResult ? "Win" : "Lose"} ${formatSui(
          content.amount_out,
        )} SUI`,
      );
    } catch (error) {
      toast.error("Flip failed");
    }
  };

  const executeSponsoredFlip = async () => {
    try {
      const gaslessTx = await buildGaslessTransaction(
        (tx) => {
          invariant(account, "Account not found");
          invariant(+deposit > 0, "Deposit must be greater than 0");

          const suiCoin = coinWithBalance({
            balance: deposit * POW_9,
            type: SUI_TYPE_ARG,
            useGasCoin: false,
          });

          tx.setSender(account!.address);

          tx.moveCall({
            package: PACKAGE_ID,
            module: "coin_flip",
            function: "flip",
            typeArguments: [],
            arguments: [tx.object(HOUSE_ID), tx.object.random(), suiCoin],
          });
        },
        {
          sui: suiClient,
        },
      );

      const response = await fetch("http://localhost:8080/sponsorTx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txBytes: gaslessTx,
        }),
      });

      gaslessTx.sender = account!.address;

      const data = await response.json();

      const { bytes, signature } = await signTransaction({
        transaction: data.txBytes,
        account: account!,
      });

      const result = await fetch("http://localhost:8080/executeSponsoredTx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txBytes: bytes,
          signature: [data.sponsorSig, signature],
        }),
      });

      const result2 = await result.json();

      const content = result2.events?.[0]?.parsedJson as FlipEvent;

      invariant(content, "Content not found");

      const flipResult = content.result;

      toast.success(
        `Flip Result: ${flipResult ? "Win" : "Lose"} ${formatSui(
          content.amount_out,
        )} SUI`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Flip failed");
    }
  };

  return (
    <Container my="2">
      <Heading mb="2">Flip</Heading>
      <Flex direction="column" gap="2" width="50rem" mb="2rem" mt="2rem">
        <TextField.Root
          type="number"
          value={deposit}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDeposit(Number(e.target.value))
          }
        />
      </Flex>
      <Button mr="2rem" onClick={executeFlip}>
        Flip
      </Button>
      <Button onClick={executeSponsoredFlip}>Sponsored Flip</Button>
    </Container>
  );
}
