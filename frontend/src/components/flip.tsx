import { useCurrentAccount, useSignTransaction } from "@mysten/dapp-kit";
import { Container, Flex, Heading, TextField, Button } from "@radix-ui/themes";
import toast from "react-hot-toast";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, HOUSE_ID } from "../constants";
import { useState } from "react";
import { suiClient } from "../networkConfig";
import { formatSui } from "../utils";
import { buildGaslessTransaction } from "@shinami/clients/sui";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";

interface FlipEvent {
  result: boolean;
  amount_in: string;
  amount_out: string;
  fee: string;
}

export function Flip() {
  const [deposit, setDeposit] = useState<number>(0);

  const executeFlip = async () => {
    try {
    } catch (error) {}
  };

  const executeSponsoredFlip = async () => {
    try {
    } catch (error) {}
  };

  return (
    <Container my="2">
      <Heading mb="2">Wallet Status</Heading>
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
