import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Container,
    Group,
    Modal,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
    Tabs,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFoodItems } from "@/hooks/use-storage";
import { FoodItem, FoodItemSchema } from "@/types";
import { useState } from "react";

dayjs.extend(relativeTime);

const CreateFoodItemSchema = FoodItemSchema.omit({ id: true, consumed: true, expiryDate: true }).extend({
  expiryDate: z.date(), // Use date object for DateInput
});
type CreateFoodItemForm = z.infer<typeof CreateFoodItemSchema>;

export const ExpiryPage = () => {
  const [foodItems, setFoodItems] = useFoodItems();
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>("all");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateFoodItemForm>({
    resolver: zodResolver(CreateFoodItemSchema),
    defaultValues: {
      name: "",
      category: "Fridge",
      expiryDate: new Date(),
    },
  });

  const onSubmit = (data: CreateFoodItemForm) => {
    const newItem: FoodItem = {
      id: crypto.randomUUID(),
      name: data.name,
      category: data.category,
      quantity: data.quantity,
      expiryDate: data.expiryDate.toISOString(),
      consumed: false,
    };
    setFoodItems([...foodItems, newItem]);
    reset();
    close();
  };

  const deleteItem = (id: string) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const consumeItem = (id: string) => {
    // For now, just delete, or mark consumed if we want history. Let's delete to keep it simple as "consumed"
    // or we could mark it consumed and filter it out. Let's delete for now as per "allow users to record... expires"
    // Usually you want to remove it from the list.
    deleteItem(id);
  };

  const getStatusColor = (expiryDate: string) => {
    const daysDiff = dayjs(expiryDate).diff(dayjs(), "day");
    if (daysDiff < 0) return "red";
    if (daysDiff <= 3) return "yellow";
    return "green";
  };

  const filteredItems = foodItems
    .filter((item) => activeTab === "all" || item.category.toLowerCase() === activeTab)
    .sort((a, b) => dayjs(a.expiryDate).diff(dayjs(b.expiryDate)));

  return (
    <Container size="md" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Food Expiry Tracker</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Add Item
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="fridge">Fridge</Tabs.Tab>
          <Tabs.Tab value="pantry">Pantry</Tabs.Tab>
          <Tabs.Tab value="freezer">Freezer</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Stack gap="md">
        {filteredItems.length === 0 ? (
          <Text c="dimmed" ta="center">
            No items in {activeTab === "all" ? "inventory" : activeTab}.
          </Text>
        ) : (
          filteredItems.map((item) => {
            const statusColor = getStatusColor(item.expiryDate);
            const isExpired = dayjs(item.expiryDate).isBefore(dayjs(), 'day');

            return (
              <Card
                key={item.id}
                shadow="sm"
                radius="md"
                withBorder
                style={{ borderLeft: `6px solid var(--mantine-color-${statusColor}-6)` }}
              >
                <Group justify="space-between" pl="xs">
                  <Stack gap={4}>
                    <Group gap="xs">
                        <Text fw={600}>{item.name}</Text>
                        <Badge color={statusColor} variant="light">
                            {isExpired ? "Expired" : dayjs(item.expiryDate).fromNow()}
                        </Badge>
                        <Badge variant="outline" size="sm">{item.category}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                       Expires: {dayjs(item.expiryDate).format("MMM D, YYYY")}
                    </Text>
                  </Stack>
                  <Group>
                    <ActionIcon
                      variant="light"
                      color="green"
                      size="lg"
                      onClick={() => consumeItem(item.id)}
                      title="Consumed"
                    >
                      <IconCheck size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => deleteItem(item.id)}
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

      <Modal opened={opened} onClose={close} title="Add Food Item">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Item Name"
              placeholder="e.g. Milk"
              {...register("name")}
              error={errors.name?.message}
            />
            
            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <Select
                        label="Category"
                        placeholder="Select category"
                        data={['Pantry', 'Fridge', 'Freezer', 'Other']}
                        {...field}
                        error={errors.category?.message}
                    />
                )}
            />

            <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                    <DateInput
                        label="Expiry Date"
                        placeholder="Select date"
                        {...field}
                        error={errors.expiryDate?.message}
                    />
                )}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};
