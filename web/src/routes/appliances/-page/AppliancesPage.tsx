import {
  ActionIcon,
  Badge,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconTool, IconTrash } from "@tabler/icons-react";
import { useLiveQuery } from "@tanstack/react-db";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { appliancesCollection } from "@/db/collections";
import { AddApplianceModal } from "../-components/AddApplianceModal";

dayjs.extend(relativeTime);

export const AppliancesPage = () => {
  const { data: appliances } = useLiveQuery(appliancesCollection);

  const markMaintained = (id: string) => {
    const app = appliances.find((a) => a.id === id);
    if (!app) return;
    appliancesCollection.update(app.id, (draft) => {
      Object.assign(draft, {
        ...app,
        lastMaintained: dayjs().toISOString(),
        nextDue: dayjs().add(app.frequencyDays, "day").toISOString(),
      });
    });
  };

  const deleteAppliance = (id: string) => {
    appliancesCollection.delete(id);
  };

  const sortedAppliances = [...appliances].sort((a, b) =>
    dayjs(a.nextDue).diff(dayjs(b.nextDue)),
  );

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Appliance Maintenance</Title>
        <AddApplianceModal />
      </Group>

      <Stack gap="md">
        {sortedAppliances.length === 0 ? (
          <Text c="dimmed" ta="center">
            No appliances tracked yet. Add one to schedule maintenance!
          </Text>
        ) : (
          sortedAppliances.map((app) => {
            const isDue = dayjs(app.nextDue).isBefore(dayjs());
            return (
              <Card key={app.id} shadow="sm" radius="md" withBorder>
                <Group justify="space-between">
                  <Stack gap={4}>
                    <Group gap="xs">
                      <Text fw={600} size="lg">
                        {app.name}
                      </Text>
                      {isDue && <Badge color="red">Maintenance Due</Badge>}
                    </Group>
                    <Text size="sm" c="dimmed">
                      Task: {app.maintenanceTask} • Every {app.frequencyDays}{" "}
                      days
                    </Text>
                    <Text size="xs" c="dimmed">
                      Next due: {dayjs(app.nextDue).format("MMM D, YYYY")} (
                      {dayjs(app.nextDue).fromNow()})
                    </Text>
                  </Stack>
                  <Group>
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size="lg"
                      onClick={() => markMaintained(app.id)}
                      title="Mark Maintenance Done"
                    >
                      <IconTool size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => deleteAppliance(app.id)}
                      title="Delete"
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            );
          })
        )}
      </Stack>
    </Container>
  );
};
