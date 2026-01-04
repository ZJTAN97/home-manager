import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  Group,
  NavLink,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLayoutDashboard, IconTimeDuration0 } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo/Logo";
import { ColorSchemeButton } from "../ColorSchemeButton/ColorSchemeButton";
import classes from "./LayoutShell.module.css";

export const LayoutShell = ({ children }: { children: ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{
        height: 60,
      }}
      navbar={{ width: 200, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header className={classes.header}>
        <Group h="100%" p="md" justify="space-between">
          <Flex gap="xs" align="center" px="sm">
            <Burger opened={opened} size="sm" hiddenFrom="sm" />
            <Logo width={40} height={40} />
          </Flex>
          <ColorSchemeButton />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className={classes.navbar}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div className={classes.links}>
          <Link to="/">
            {({ isActive }) => (
              <NavLink
                leftSection={<IconLayoutDashboard size={18} />}
                component="div"
                active={isActive}
                label={
                  <Text pt={1} fw={500} size="xs">
                    Overview
                  </Text>
                }
              />
            )}
          </Link>
          <Link to="/expiry">
            {({ isActive }) => (
              <NavLink
                leftSection={<IconTimeDuration0 size={18} />}
                component="div"
                active={isActive}
                label={
                  <Text pt={1} fw={500} size="xs">
                    Expiry Checker
                  </Text>
                }
              />
            )}
          </Link>
        </div>
        <div className={classes.footer}>
          <Avatar m="sm" />
        </div>
      </AppShell.Navbar>
      <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    </AppShell>
  );
};
