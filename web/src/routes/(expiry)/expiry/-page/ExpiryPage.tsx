import { useLiveQuery } from "@electric-sql/pglite-react";
import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconCubePlus, IconSearch } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ExpiryItemResponseType } from "../../expiry_.new/-data/dto";

dayjs.extend(relativeTime);

export const ExpiryPage = () => {
  const expiryItems = useLiveQuery<ExpiryItemResponseType>(
    `
    SELECT 
      id,
      name,
      description,
      expiry_date AS "expiryDate"
    FROM expiry
    `,
    []
  );

  return (
    <Stack px="md" py="sm">
      <Flex gap="md" align="center">
        <TextInput
          leftSection={<IconSearch />}
          placeholder="Search for item"
          disabled
          radius="md"
          w="100%"
        />
        <ActionIcon
          c="pink.3"
          variant="subtle"
          renderRoot={(props) => <Link to="/expiry/new" {...props} />}
        >
          <IconCubePlus size={18} />
        </ActionIcon>
      </Flex>
      {expiryItems?.rows ? (
        <Grid gutter="lg">
          {expiryItems.rows.map((item) => (
            <Grid.Col key={item.id} span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="xs" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>{item.name}</Text>
                  {dayjs(item.expiryDate).diff(dayjs(), "days") < 10 ? (
                    <Badge color="pink">Expiring Soon</Badge>
                  ) : null}
                </Group>

                <Text size="sm" c="dimmed">
                  {item.description}
                </Text>

                <Badge
                  color="green.5"
                  mt="md"
                  py="sm"
                  radius="sm"
                  variant="light"
                >
                  expire {dayjs(item.expiryDate).fromNow()}
                </Badge>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <Loader mt="20dvh" mx="auto" />
      )}
    </Stack>
  );
};
