import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { formatSui } from "./utils";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";

export function WalletStatus() {
  const account = useCurrentAccount();

  const { data } = useSuiClientQuery("getBalance", {
    owner: account?.address || "0x0",
    coinType: SUI_TYPE_ARG,
  });

  return (
    <Container my="2">
      <Heading mb="2">Wallet Status</Heading>

      {account ? (
        <Flex direction="column">
          <Text>Wallet connected</Text>
          <Text>Address: {account.address}</Text>
          <Text>Balance: {formatSui(data?.totalBalance || "0")} SUI</Text>
        </Flex>
      ) : (
        <Text>Wallet not connected</Text>
      )}
    </Container>
  );
}
