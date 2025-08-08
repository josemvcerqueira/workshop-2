import { useSuiClientQuery } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { HOUSE_ID } from "../constants";
import { pathOr } from "ramda";
import { formatSui } from "../utils";

export function House() {
  const { data, error, isLoading } = useSuiClientQuery("getObject", {
    id: HOUSE_ID,
    options: {
      showContent: true,
    },
  });

  if (error) {
    return <Flex>Error: {error.message}</Flex>;
  }

  if (isLoading || !data) {
    return <Flex>Loading...</Flex>;
  }

  const fields = pathOr({}, ["data", "content", "fields"], data);

  return (
    <Container my="2">
      <Heading mb="2">House</Heading>
      {data ? (
        <Flex direction="column">
          <Text>ID: {pathOr("", ["id", "id"], fields)}</Text>
          <Text>Fee: {pathOr("", ["fee"], fields)}</Text>
          <Text>Max: {pathOr("", ["max"], fields)}</Text>
          <Text>Pool Balance: {formatSui(pathOr("0", ["pool"], fields))}</Text>
          <Text>
            Treasury Balance: {formatSui(pathOr("0", ["treasury"], fields))}
          </Text>
        </Flex>
      ) : null}
    </Container>
  );
}
