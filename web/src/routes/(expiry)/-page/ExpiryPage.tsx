import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";

const items = [
  {
    id: 1,
    name: "Eggs",
    description: "Eggs bought from NTUC finest",
    imageUrl:
      "https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg",
    expiryDate: "",
  },
  {
    id: 2,
    name: "Kimchi",
    description: "Kimchi bought from NTUC finest",
    imageUrl:
      "https://media.nedigital.sg/fairprice/fpol/media/images/product/XL/12561382_XL1_20210122.jpg",
    expiryDate: "",
  },
  {
    id: 3,
    name: "Ham",
    description: "Ham bought from NTUC finest",
    imageUrl:
      "https://www.cutbutchery.sg/cdn/shop/files/GAMMON_HAM_1080x.png?v=1732276667",
    expiryDate: "",
  },
];

export const ExpiryPage = () => {
  return (
    <Stack px="md" py="sm">
      <Flex justify="space-between">
        <TextInput
          leftSection={<IconSearch />}
          placeholder="Search for item"
          radius="md"
          w="50%"
        />
        <Button leftSection={<IconPlus size={18} />} variant="light">
          New Item
        </Button>
      </Flex>
      <Grid gutter="lg">
        {items.map((item) => (
          <Grid.Col key={item.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="xs" padding="lg" radius="md" withBorder>
              <Card.Section>
                <Image src={item.imageUrl} height={160} alt="Norway" />
              </Card.Section>

              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{item.name}</Text>
                <Badge color="pink">Expiring Soon</Badge>
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
                10 days left
              </Badge>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
