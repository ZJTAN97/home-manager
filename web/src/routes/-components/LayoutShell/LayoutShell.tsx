import { AppShell, Avatar, Burger, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import classes from "./LayoutShell.module.css";

export const LayoutShell = ({ children }: { children: ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{
        height: 60,
      }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header className={classes.header}>
        <Group h="100%" p="md">
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          Home Manager
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className={classes.navbar}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div className={classes.links}>
          <Link to="/">
            {({ isActive }) => (
              <NavLink component="div" active={isActive} label="Overview" />
            )}
          </Link>
          <Link to="/expiry">
            {({ isActive }) => (
              <NavLink
                component="div"
                active={isActive}
                label="Expiry Checker"
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
