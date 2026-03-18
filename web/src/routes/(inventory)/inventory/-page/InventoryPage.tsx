import {
  Avatar,
  Container,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCheck,
  IconDotsVertical,
  IconPencil,
  IconSearch,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useLiveQuery } from "@tanstack/react-db";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRef, useState } from "react";
import { inventoryCollection } from "@/db/collections";
import type { InventoryResponse } from "@/schema/inventory";
import {
  InventoryItemModal,
  type InventoryItemModalRef,
} from "../-components/InventoryItemModal";
import classes from "./InventoryPage.module.css";

dayjs.extend(relativeTime);

export const InventoryPage = () => {
  const { data } = useLiveQuery(inventoryCollection);
  const [searchQuery, setSearchQuery] = useState("");
  const modalRef = useRef<InventoryItemModalRef>(null);

  const deleteItem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    inventoryCollection.delete(id);
  };

  const consumeItem = (item: InventoryResponse, e?: React.MouseEvent) => {
    e?.stopPropagation();
    inventoryCollection.update(item.id, (draft) => {
      Object.assign(draft, { ...item, consumed: true });
    });
  };

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
          <Text className={classes.title}>Inventory</Text>
        </div>
        <Group gap="sm">
          <InventoryItemModal ref={modalRef} />
          <Avatar radius="xl" color="gray">
            <IconUser size={20} />
          </Avatar>
        </Group>
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
            className={`${classes.filterPill}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className={classes.itemList}>
        {data.length === 0 ? (
          <Text c="dimmed" ta="center" mt="xl">
            No items found.
          </Text>
        ) : (
          data.map((item) => {
            const status = getStatus(item.expiryDate);
            const isBeauty =
              item.category === "Skin Care" || item.category === "Makeup";

            return (
              <button
                type="button"
                key={item.id}
                className={classes.itemCard}
                onClick={() => modalRef.current?.openEdit(item)}
              >
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
                      leftSection={<IconPencil size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        modalRef.current?.openEdit(item);
                      }}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconCheck size={14} />}
                      onClick={(e) => consumeItem(item, e)}
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
              </button>
            );
          })
        )}
      </div>
    </Container>
  );
};
