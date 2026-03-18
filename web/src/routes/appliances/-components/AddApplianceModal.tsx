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
import { appliancesCollection } from "@/db/collections";
import { type ApplianceResponse, applianceSchema } from "@/schema/appliance";

const CreateApplianceSchema = applianceSchema.omit({
  id: true,
  lastMaintained: true,
  nextDue: true,
});
type CreateApplianceForm = z.infer<typeof CreateApplianceSchema>;

export const AddApplianceModal = () => {
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
    const newAppliance: ApplianceResponse = {
      id: crypto.randomUUID(),
      ...data,
      nextDue: dayjs().add(data.frequencyDays, "day").toISOString(),
    };
    appliancesCollection.insert(newAppliance);
    reset();
    close();
  };

  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={open}>
        Add Appliance
      </Button>

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
    </>
  );
};
