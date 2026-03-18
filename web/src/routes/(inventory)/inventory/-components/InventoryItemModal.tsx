import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Button,
  FileInput,
  Group,
  Image,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { inventoryCollection } from "@/db/collections";
import {
  type InventoryCreateRequest,
  type InventoryResponse,
  inventoryCreateSchema,
} from "@/schema/inventory";
import { Route } from "../route";

export interface InventoryItemModalRef {
  openEdit: (item: InventoryResponse) => void;
}

export const InventoryItemModal = forwardRef<InventoryItemModalRef>(
  (_props, ref) => {
    const [opened, { open, close: mantineClose }] = useDisclosure(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [editingItem, setEditingItem] = useState<InventoryResponse | null>(
      null,
    );

    const search = Route.useSearch();
    const navigate = useNavigate();

    const {
      register,
      handleSubmit,
      control,
      reset,
      setValue,
      formState: { errors },
    } = useForm<InventoryCreateRequest>({
      resolver: zodResolver(inventoryCreateSchema),
      defaultValues: {
        name: "",
        category: "Fridge",
        expiryDate: new Date().toISOString(),
      },
    });

    const close = () => {
      mantineClose();
      setEditingItem(null);
      if (search.modal) {
        navigate({ to: "/inventory", search: { modal: undefined } });
      }
    };

    const openAddModal = () => {
      setEditingItem(null);
      setImageFile(null);
      reset({
        name: "",
        category: "Fridge",
        expiryDate: new Date().toISOString(),
        dateOpened: undefined,
        shelfLifeMonths: undefined,
      });
      open();
    };

    const openEditModal = (item: InventoryResponse) => {
      setEditingItem(item);
      setImageFile(null);
      reset({
        name: item.name,
        category: item.category,
        expiryDate: new Date(item.expiryDate).toISOString(),
        dateOpened: item.dateOpened
          ? new Date(item.dateOpened).toISOString()
          : undefined,
        shelfLifeMonths: item.shelfLifeMonths,
        quantity: item.quantity,
      });
      open();
    };

    useImperativeHandle(ref, () => ({
      openEdit: openEditModal,
    }));

    useEffect(() => {
      if (search.modal === "add") {
        openAddModal();
      }
    }, [search.modal]);

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
          .toISOString();
        setValue("expiryDate", calculatedExpiry);
      }
    }, [dateOpened, shelfLifeMonths, setValue]);

    const onSubmit = (data: InventoryCreateRequest) => {
      const processSubmit = (imageBase64?: string) => {
        if (editingItem) {
          inventoryCollection.update(editingItem.id, (draft) => {
            Object.assign(draft, {
              ...editingItem,
              name: data.name,
              category: data.category,
              quantity: data.quantity,
              expiryDate: data.expiryDate,
              image: imageBase64 ?? editingItem.image,
              dateOpened: data.dateOpened,
              shelfLifeMonths: data.shelfLifeMonths,
            });
          });
        } else {
          inventoryCollection.insert({
            id: crypto.randomUUID(),
            name: data.name,
            category: data.category,
            quantity: data.quantity,
            expiryDate: data.expiryDate,
            consumed: false,
            image: imageBase64,
            dateOpened: data.dateOpened,
            shelfLifeMonths: data.shelfLifeMonths,
          });
        }
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

    const isBeautyCategory =
      category === "Skin Care" || category === "Makeup";

    return (
      <>
        <ActionIcon
          variant="filled"
          color="green"
          size="lg"
          radius="xl"
          onClick={openAddModal}
          aria-label="Add item"
        >
          <IconPlus size={20} />
        </ActionIcon>

        <Modal
          opened={opened}
          onClose={close}
          title={editingItem ? "Edit Item" : "Add Item"}
          centered
          radius="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              {editingItem?.image && !imageFile && (
                <Image
                  src={editingItem.image}
                  alt={editingItem.name}
                  radius="md"
                  h={120}
                  fit="contain"
                />
              )}

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
                        min={1}
                        max={120}
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
                  {editingItem ? "Save Changes" : "Add Item"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </>
    );
  },
);
