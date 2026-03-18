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
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { useLiveQuery } from "@tanstack/react-db";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { choresCollection } from "@/db/collections";
import { AddChoreModal } from "../-components/AddChoreModal";

dayjs.extend(relativeTime);

export const ChoresPage = () => {
  const { data: chores } = useLiveQuery(choresCollection);

  const markComplete = (id: string) => {
    const chore = chores.find((c) => c.id === id);
    if (!chore) return;
    choresCollection.update(chore.id, (draft) => {
      Object.assign(draft, {
        ...chore,
        lastDone: dayjs().toISOString(),
        nextDue: dayjs().add(chore.frequencyDays, "day").toISOString(),
      });
    });
  };

  const deleteChore = (id: string) => {
    choresCollection.delete(id);
  };

  const sortedChores = [...chores].sort((a, b) =>
    dayjs(a.nextDue).diff(dayjs(b.nextDue)),
  );

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Housekeeping Chores</Title>
        <AddChoreModal />
      </Group>

      <Stack gap="md">
        {sortedChores.length === 0 ? (
          <Text c="dimmed" ta="center">
            No chores added yet. Add one to get started!
          </Text>
        ) : (
          sortedChores.map((chore) => {
            const isDue = dayjs(chore.nextDue).isBefore(dayjs());
            return (
              <Card key={chore.id} shadow="sm" radius="md" withBorder>
                <Group justify="space-between">
                  <Stack gap={4}>
                    <Group gap="sm">
                      <Text fw={600}>{chore.name}</Text>
                      {isDue && <Badge color="red">Due</Badge>}
                    </Group>
                    <Text size="sm" c="dimmed">
                      Every {chore.frequencyDays} days • Next due{" "}
                      {dayjs(chore.nextDue).fromNow()}
                    </Text>
                  </Stack>
                  <Group>
                    <ActionIcon
                      variant="light"
                      color="green"
                      size="lg"
                      onClick={() => markComplete(chore.id)}
                      title="Mark as done"
                    >
                      <IconCheck size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => deleteChore(chore.id)}
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
