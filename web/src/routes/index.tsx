import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, SimpleGrid, Card, Text, Title, Group, ThemeIcon, Alert } from "@mantine/core";
import { IconAlertCircle, IconFridge, IconRotateClockwise2, IconWashMachine } from "@tabler/icons-react";
import { useFoodItems, useChores, useAppliances } from "@/hooks/use-storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const [foodItems] = useFoodItems();
  const [chores] = useChores();
  const [appliances] = useAppliances();

  const expiringSoonCount = foodItems.filter((item) => {
    const diff = dayjs(item.expiryDate).diff(dayjs(), "day");
    return diff <= 3 && diff >= 0;
  }).length;

  const expiredCount = foodItems.filter((item) => dayjs(item.expiryDate).isBefore(dayjs(), 'day')).length;

  const choresDueCount = chores.filter((chore) => dayjs(chore.nextDue).isBefore(dayjs(), 'day') || dayjs(chore.nextDue).isSame(dayjs(), 'day')).length;

  const appliancesDueCount = appliances.filter((app) => dayjs(app.nextDue).isBefore(dayjs(), 'day') || dayjs(app.nextDue).isSame(dayjs(), 'day')).length;

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg">
        Overview
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card shadow="sm" padding="lg" radius="md" withBorder component={Link} to="/expiry">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Food Expiry</Text>
            <ThemeIcon color="red" variant="light">
              <IconFridge size={16} />
            </ThemeIcon>
          </Group>
          <Text size="xl" fw={700}>
            {expiringSoonCount + expiredCount}
          </Text>
          <Text size="sm" c="dimmed">
            Items expiring soon or expired
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder component={Link} to="/chores">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Chores Due</Text>
            <ThemeIcon color="blue" variant="light">
              <IconRotateClockwise2 size={16} />
            </ThemeIcon>
          </Group>
          <Text size="xl" fw={700}>
            {choresDueCount}
          </Text>
          <Text size="sm" c="dimmed">
            Chores needing attention
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder component={Link} to="/appliances">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Maintenance</Text>
            <ThemeIcon color="green" variant="light">
              <IconWashMachine size={16} />
            </ThemeIcon>
          </Group>
          <Text size="xl" fw={700}>
            {appliancesDueCount}
          </Text>
          <Text size="sm" c="dimmed">
            Appliances due for service
          </Text>
        </Card>
      </SimpleGrid>

      {(expiredCount > 0 || choresDueCount > 0 || appliancesDueCount > 0) && (
        <Alert variant="light" color="orange" title="Action Needed" icon={<IconAlertCircle />} mt="xl">
            You have pending items:
            <ul>
                {expiredCount > 0 && <li>{expiredCount} food items expired!</li>}
                {choresDueCount > 0 && <li>{choresDueCount} chores due.</li>}
                {appliancesDueCount > 0 && <li>{appliancesDueCount} appliances need maintenance.</li>}
            </ul>
        </Alert>
      )}
    </Container>
  );
}
