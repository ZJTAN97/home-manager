import {
  ActionIcon,
  Container,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBell,
  IconChevronRight,
  IconFridge,
  IconSparkles,
  IconTool,
} from "@tabler/icons-react";
import { useLiveQuery } from "@tanstack/react-db";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Logo } from "@/components/Logo/Logo";
import {
  appliancesCollection,
  choresCollection,
  inventoryCollection,
} from "@/db/collections";
import classes from "./DashboardPage.module.css";

export const DashboardPage = () => {
  const { data: inventoryItems } = useLiveQuery(inventoryCollection);
  const { data: chores } = useLiveQuery(choresCollection);
  const { data: appliances } = useLiveQuery(appliancesCollection);

  // Calculate stats
  const expiringSoonCount = inventoryItems.filter((item) => {
    const diff = dayjs(item.expiryDate).diff(dayjs(), "day");
    return diff <= 3 && diff >= 0;
  }).length;

  const expiredCount = inventoryItems.filter((item) =>
    dayjs(item.expiryDate).isBefore(dayjs(), "day")
  ).length;
  const choresDueCount = chores.filter(
    (chore) =>
      dayjs(chore.nextDue).isBefore(dayjs(), "day") ||
      dayjs(chore.nextDue).isSame(dayjs(), "day")
  ).length;
  const appliancesDueCount = appliances.filter(
    (app) =>
      dayjs(app.nextDue).isBefore(dayjs(), "day") ||
      dayjs(app.nextDue).isSame(dayjs(), "day")
  ).length;

  // Calculate Health
  const health = useMemo(() => {
    let score = 100;
    score -= expiredCount * 10;
    score -= expiringSoonCount * 2;
    score -= choresDueCount * 5;
    score -= appliancesDueCount * 5;
    return Math.max(0, Math.min(100, score));
  }, [expiredCount, expiringSoonCount, choresDueCount, appliancesDueCount]);

  const today = dayjs().format("dddd, MMMM D");

  return (
    <Container size="md" className={classes.container}>
      {/* Header */}
      <div className={classes.header}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                background: "#e0fcd4",
                borderRadius: "50%",
                padding: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Logo width={32} height={32} />
            </div>
            <div>
              <Title order={2} className={classes.greeting}>
                Welcome back
              </Title>
              <Text className={classes.date}>{today}</Text>
            </div>
          </div>
        </div>
        <ActionIcon variant="light" color="gray" radius="xl" size="xl">
          <IconBell size={20} />
        </ActionIcon>
      </div>

      {/* Home Health Card */}
      <div className={classes.healthCard}>
        <Flex justify="space-between" align="center">
          <Text className={classes.healthTitle}>HOME HEALTH</Text>
          <Text className={classes.healthValue}>{health}%</Text>
        </Flex>

        <div className={classes.progressBarContainer}>
          <div
            className={classes.progressBar}
            style={{ width: `${health}%` }}
          />
        </div>

        <div className={classes.healthMessage}>
          <IconSparkles size={16} />
          <Text>Your home is {health}% synchronized today.</Text>
        </div>
      </div>

      {/* Quick Actions */}
      <Stack gap="lg">
        <Text className={classes.sectionTitle}>Quick Actions</Text>

        <div className={classes.actionList}>
          <Link to="/inventory" className={classes.actionCard}>
            <div
              className={classes.iconWrapper}
              style={{ backgroundColor: "#fff4e6" }}
            >
              <IconFridge size={24} color="#fd7e14" />
            </div>
            <div className={classes.actionContent}>
              <Text className={classes.actionLabel}>Inventory</Text>
              <Text className={classes.actionSubtext}>
                {expiringSoonCount > 0
                  ? `${expiringSoonCount} items expiring soon`
                  : expiredCount > 0
                    ? `${expiredCount} items expired`
                    : "All good!"}
              </Text>
            </div>
            <IconChevronRight className={classes.chevron} />
          </Link>

          <Link to="/appliances" className={classes.actionCard}>
            <div
              className={classes.iconWrapper}
              style={{ backgroundColor: "#e7f5ff" }}
            >
              <IconTool size={24} color="#228be6" />
            </div>
            <div className={classes.actionContent}>
              <Text className={classes.actionLabel}>Maintenance Alerts</Text>
              <Text className={classes.actionSubtext}>
                {appliancesDueCount > 0
                  ? `${appliancesDueCount} tasks due`
                  : "Systems nominal"}
              </Text>
            </div>
            <IconChevronRight className={classes.chevron} />
          </Link>

          <Link to="/chores" className={classes.actionCard}>
            <div
              className={classes.iconWrapper}
              style={{ backgroundColor: "#f3d9fa" }}
            >
              <IconSparkles size={24} color="#be4bdb" />
            </div>
            <div className={classes.actionContent}>
              <Text className={classes.actionLabel}>Upcoming Cleans</Text>
              <Text className={classes.actionSubtext}>
                {choresDueCount > 0
                  ? `${choresDueCount} chores pending`
                  : "Nothing specifically due"}
              </Text>
            </div>
            <IconChevronRight className={classes.chevron} />
          </Link>
        </div>
      </Stack>
    </Container>
  );
};
