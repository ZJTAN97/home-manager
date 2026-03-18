import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { choresCollection } from "@/db/collections";
import { type ChoreResponse, choreSchema } from "@/schema/chore";

const CreateChoreSchema = choreSchema.omit({
  id: true,
  lastDone: true,
  nextDue: true,
});
type CreateChoreForm = z.infer<typeof CreateChoreSchema>;

export const AddChoreModal = () => {
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
    const newChore: ChoreResponse = {
      id: crypto.randomUUID(),
      ...data,
      nextDue: dayjs().add(data.frequencyDays, "day").toISOString(),
    };
    choresCollection.insert(newChore);
    reset();
    close();
  };

  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={open}>
        Add Chore
      </Button>

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
    </>
  );
};
