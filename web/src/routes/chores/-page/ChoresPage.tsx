import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useChores } from "@/hooks/use-db";
import { type Chore, ChoreSchema } from "@/types";

dayjs.extend(relativeTime);

const CreateChoreSchema = ChoreSchema.omit({
  id: true,
  lastDone: true,
  nextDue: true,
});
type CreateChoreForm = z.infer<typeof CreateChoreSchema>;

export const ChoresPage = () => {
  const { items: chores, addItem, updateItem, removeItem } = useChores();
  const [opened, { open, close }] = useDisclosure(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateChoreForm>({
    resolver: zodResolver(CreateChoreSchema),
    defaultValues: {
      name: "",
      frequencyDays: 7,
    },
  });

  const onSubmit = (data: CreateChoreForm) => {
    const newChore: Chore = {
      id: crypto.randomUUID(),
      ...data,
      nextDue: dayjs().add(data.frequencyDays, "day").toISOString(),
    };
    addItem(newChore);
    reset();
    close();
  };

  const markComplete = (id: string) => {
    const chore = chores.find((c) => c.id === id);
    if (!chore) return;
    updateItem({
      ...chore,
      lastDone: dayjs().toISOString(),
      nextDue: dayjs().add(chore.frequencyDays, "day").toISOString(),
    });
  };

  const deleteChore = (id: string) => {
    removeItem(id);
  };

  const sortedChores = [...chores].sort((a, b) =>
    dayjs(a.nextDue).diff(dayjs(b.nextDue))
  );

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Housekeeping Chores</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Add Chore
        </Button>
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

      <Modal opened={opened} onClose={close} title="Add New Chore">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Chore Name"
              placeholder="e.g. Vacuum living room"
              {...register("name")}
              error={errors.name?.message}
            />
            <NumberInput
              label="Frequency (Days)"
              defaultValue={7}
              min={1}
              onChange={(val) => setValue("frequencyDays", Number(val))}
              error={errors.frequencyDays?.message}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">Create Chore</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};
