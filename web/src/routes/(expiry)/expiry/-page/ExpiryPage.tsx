import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Button,
  Container,
  FileInput,
  Group,
  Menu,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconDotsVertical,
  IconSearch,
  IconTrash,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useExpiryItems } from "@/hooks/use-db";
import { type ExpiryItem, ExpiryItemSchema } from "@/types";
import { Route } from "../route";
import classes from "./ExpiryPage.module.css";

dayjs.extend(relativeTime);

const CreateExpiryItemSchema = ExpiryItemSchema.omit({
  id: true,
  consumed: true,
  expiryDate: true,
  image: true,
  dateOpened: true,
  shelfLifeMonths: true,
}).extend({
  expiryDate: z.date(),
  dateOpened: z.date().optional(),
  shelfLifeMonths: z.number().optional(),
});

type CreateExpiryItemForm = z.infer<typeof CreateExpiryItemSchema>;

export const ExpiryPage = () => {
  const { items: expiryItems, addItem, removeItem } = useExpiryItems();
  const [opened, { open, close: mantineClose }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const search = Route.useSearch();
  const navigate = useNavigate();

  const close = () => {
    mantineClose();
    // Remove modal param if present
    if (search.modal) {
      navigate({ to: "/expiry", search: { modal: undefined } });
    }
  };

  useEffect(() => {
    if (search.modal === "add") {
      open();
    }
  }, [search.modal]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateExpiryItemForm>({
    resolver: zodResolver(CreateExpiryItemSchema),
    defaultValues: {
      name: "",
      category: "Fridge",
      expiryDate: new Date(),
    },
  });

  const category = useWatch({ control, name: "category" });
  const dateOpened = useWatch({ control, name: "dateOpened" });
  const shelfLifeMonths = useWatch({
    control,
    name: "shelfLifeMonths",
  });

  useEffect(() => {
    if (dateOpened && shelfLifeMonths) {
      const calculatedExpiry = dayjs(dateOpened)
        .add(shelfLifeMonths, "month")
        .toDate();
      setValue("expiryDate", calculatedExpiry);
    }
  }, [dateOpened, shelfLifeMonths, setValue]);

  const onSubmit = (data: CreateExpiryItemForm) => {
    const processSubmit = (imageBase64?: string) => {
      const newItem: ExpiryItem = {
        id: crypto.randomUUID(),
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        expiryDate: data.expiryDate.toISOString(),
        consumed: false,
        image: imageBase64,
        dateOpened: data.dateOpened?.toISOString(),
        shelfLifeMonths: data.shelfLifeMonths,
      };
      addItem(newItem);
      reset();
      setImageFile(null);
      close();
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processSubmit(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      processSubmit();
    }
  };

  const deleteItem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    removeItem(id);
  };

  const consumeItem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    removeItem(id);
  };

  const filteredItems = expiryItems
    .filter((item) => {
      const queryMatch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!queryMatch) return false;

      if (activeTab === "all") return true;
      if (activeTab === "skin-care")
        return item.category === "Skin Care" || item.category === "Makeup";
      return item.category.toLowerCase() === activeTab;
    })
    .sort((a, b) => dayjs(a.expiryDate).diff(dayjs(b.expiryDate)));

  const isBeautyCategory = category === "Skin Care" || category === "Makeup";

  const getStatus = (expiryDate: string) => {
    const daysDiff = dayjs(expiryDate).diff(dayjs(), "day");
    if (daysDiff < 0)
      return {
        label: "EXPIRED",
        color: "red",
        className: classes.statusExpired,
      };
    if (daysDiff <= 3)
      return {
        label: "URGENT",
        color: "yellow",
        className: classes.statusExpiring,
      };
    if (daysDiff <= 7)
      return {
        label: "EXPIRING",
        color: "orange",
        className: classes.statusExpiring,
      };
    return {
      label: "FRESH",
      color: "green",
      className: classes.statusFresh,
    };
  };

  const categories = [
    { id: "all", label: "All" },
    { id: "fridge", label: "Fridge" },
    { id: "pantry", label: "Dry Goods" },
    { id: "freezer", label: "Freezer" },
    { id: "skin-care", label: "Beauty" },
  ];

  return (
    <Container size="md" className={classes.container}>
      {/* Header */}
      <div className={classes.header}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "#e0fcd4",
              borderRadius: "50%",
              padding: 8,
            }}
          >
            <IconCheck size={20} color="#2b8a3e" />
          </div>
          <Text className={classes.title}>Pantry</Text>
        </div>
        <Avatar radius="xl" color="gray">
          <IconUser size={20} />
        </Avatar>
      </div>

      {/* Search */}
      <div className={classes.searchContainer}>
        <div className={classes.searchInput}>
          <IconSearch size={18} color="var(--mantine-color-gray-5)" />
          <input
            type="text"
            placeholder="Search your goodies..."
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              flex: 1,
              fontSize: 16,
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className={classes.filters}>
        {categories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            className={`${classes.filterPill} ${activeTab === cat.id ? classes.filterPillActive : ""}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className={classes.itemList}>
        {filteredItems.length === 0 ? (
          <Text c="dimmed" ta="center" mt="xl">
            No items found.
          </Text>
        ) : (
          filteredItems.map((item) => {
            const status = getStatus(item.expiryDate);
            const isBeauty =
              item.category === "Skin Care" || item.category === "Makeup";

            return (
              <div key={item.id} className={classes.itemCard}>
                <img
                  src={item.image || "https://placehold.co/60x60?text=Item"}
                  alt={item.name}
                  className={classes.itemImage}
                />

                <div className={classes.itemContent}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text className={classes.itemName}>{item.name}</Text>
                    <div
                      className={`${classes.statusBadge} ${status.className}`}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "currentColor",
                        }}
                      />
                      {status.label}
                    </div>
                  </div>

                  <Text className={classes.itemSubtitle}>
                    {isBeauty && item.dateOpened
                      ? `Opened ${dayjs(item.dateOpened).fromNow()}`
                      : `Expiring ${dayjs(item.expiryDate).fromNow()}`}
                  </Text>
                </div>

                <Menu position="bottom-end" withArrow>
                  <Menu.Target>
                    <UnstyledButton
                      className={classes.actionsButton}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconDotsVertical size={20} />
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconCheck size={14} />}
                      onClick={(e) => consumeItem(item.id, e)}
                      color="green"
                    >
                      Consume
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconTrash size={14} />}
                      onClick={(e) => deleteItem(item.id, e)}
                      color="red"
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            );
          })
        )}
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="Add Expiry Item"
        centered
        radius="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Item Name"
              placeholder="e.g. Milk, Face Cream"
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
                  data={[
                    "Pantry",
                    "Fridge",
                    "Freezer",
                    "Skin Care",
                    "Makeup",
                    "Other",
                  ]}
                  {...field}
                  error={errors.category?.message}
                />
              )}
            />

            {isBeautyCategory && (
              <Group grow>
                <Controller
                  name="dateOpened"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      label="Date Opened"
                      placeholder="When did you open it?"
                      clearable
                      {...field}
                      error={errors.dateOpened?.message}
                    />
                  )}
                />
                <Controller
                  name="shelfLifeMonths"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      label="Period After Opening (Months)"
                      placeholder="e.g. 12"
                      min={0}
                      {...field}
                      error={errors.shelfLifeMonths?.message}
                    />
                  )}
                />
              </Group>
            )}

            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <DateInput
                  label="Expiry Date"
                  description={
                    isBeautyCategory
                      ? "Auto-calculated if Date Opened is set"
                      : undefined
                  }
                  placeholder="Select date"
                  {...field}
                  error={errors.expiryDate?.message}
                />
              )}
            />

            <FileInput
              label="Upload Photo"
              placeholder="Select image"
              accept="image/*"
              leftSection={<IconUpload size={14} />}
              value={imageFile}
              onChange={setImageFile}
              clearable
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" color="green">
                Add Item
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};
