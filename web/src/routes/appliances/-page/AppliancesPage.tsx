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
import { IconPlus, IconTool, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useAppliances } from "@/hooks/use-db";
import { type Appliance, ApplianceSchema } from "@/types";

dayjs.extend(relativeTime);

const CreateApplianceSchema = ApplianceSchema.omit({
  id: true,
  lastMaintained: true,
  nextDue: true,
});
type CreateApplianceForm = z.infer<typeof CreateApplianceSchema>;

export const AppliancesPage = () => {
  const {
    items: appliances,
    addItem,
    updateItem,
    removeItem,
  } = useAppliances();
  const [opened, { open, close }] = useDisclosure(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateApplianceForm>({
    resolver: zodResolver(CreateApplianceSchema),
    defaultValues: {
      name: "",
      maintenanceTask: "",
      frequencyDays: 30,
    },
  });

  const onSubmit = (data: CreateApplianceForm) => {
    const newAppliance: Appliance = {
      id: crypto.randomUUID(),
      ...data,
      nextDue: dayjs().add(data.frequencyDays, "day").toISOString(),
    };
    addItem(newAppliance);
    reset();
    close();
  };

  const markMaintained = (id: string) => {
    const app = appliances.find((a) => a.id === id);
    if (!app) return;
    updateItem({
      ...app,
      lastMaintained: dayjs().toISOString(),
      nextDue: dayjs().add(app.frequencyDays, "day").toISOString(),
    });
  };

  const deleteAppliance = (id: string) => {
    removeItem(id);
  };

  const sortedAppliances = [...appliances].sort((a, b) =>
    dayjs(a.nextDue).diff(dayjs(b.nextDue))
  );

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Appliance Maintenance</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Add Appliance
        </Button>
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

      <Modal opened={opened} onClose={close} title="Add New Appliance">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Appliance Name"
              placeholder="e.g. Dishwasher"
              {...register("name")}
              error={errors.name?.message}
            />
            <TextInput
              label="Maintenance Task"
              placeholder="e.g. Clean filter"
              {...register("maintenanceTask")}
              error={errors.maintenanceTask?.message}
            />
            <NumberInput
              label="Frequency (Days)"
              defaultValue={30}
              min={1}
              onChange={(val) => setValue("frequencyDays", Number(val))}
              error={errors.frequencyDays?.message}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">Track Appliance</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};
