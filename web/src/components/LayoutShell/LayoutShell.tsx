import {
  ActionIcon,
  AppShell,
  Flex,
  Group,
  NavLink,
  rem,
  Switch,
  Text,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBox,
  IconChecklist,
  IconFridge,
  IconHome,
  IconLayoutDashboard,
  IconMoonStars,
  IconPlus,
  IconRotateClockwise2,
  IconSettings,
  IconSun,
  IconWashMachine,
} from "@tabler/icons-react";
import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo/Logo";
import classes from "./LayoutShell.module.css";

function ThemeToggle({ compact }: { compact?: boolean }) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const toggle = () =>
    setColorScheme(colorScheme === "dark" ? "light" : "dark");

  if (compact) {
    return (
      <ActionIcon onClick={toggle} variant="subtle" color="gray" size="lg">
        {colorScheme === "dark" ? (
          <IconSun size={20} />
        ) : (
          <IconMoonStars size={20} />
        )}
      </ActionIcon>
    );
  }

  const sunIcon = (
    <IconSun
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.yellow[4]}
    />
  );

  const moonIcon = (
    <IconMoonStars
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.blue[6]}
    />
  );

  return (
    <Group
      justify="center"
      p="md"
      style={{
        borderTop: `1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))`,
      }}
    >
      <Switch
        size="md"
        color="dark.4"
        onLabel={sunIcon}
        offLabel={moonIcon}
        checked={colorScheme === "auto" ? false : colorScheme === "dark"}
        onChange={(event) =>
          setColorScheme(event.currentTarget.checked ? "dark" : "light")
        }
      />
    </Group>
  );
}

export const LayoutShell = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
    <AppShell
      withBorder={false}
      navbar={{ width: 220, breakpoint: "sm", collapsed: { mobile: true } }} // Always collapse desktop navbar on mobile
      padding={0} // We handle padding manually in CSS for mobile
    >
      <AppShell.Navbar className={classes.navbar} visibleFrom="sm">
        <Flex gap="xs" align="center" my="md">
          <Logo width={40} height={40} />
          <Text fw={700}>HomeMgr</Text>
        </Flex>

        <div className={classes.links}>
          <NavLinks />
        </div>
        <ThemeToggle />
      </AppShell.Navbar>

      <AppShell.Main>
        <div className={classes.main}>
          {/* Scrollable Content */}
          <div className={classes.root}>{children}</div>

          {/* Mobile Bottom Navigation */}
          <div className={classes.mobileNavContainer}>
            <div className={classes.fabWrapper}>
              <UnstyledButton
                className={classes.fab}
                onClick={() => router.navigate({ to: "/inventory" })}
              >
                <IconPlus size={32} />
              </UnstyledButton>
            </div>

            <div className={classes.mobileNavContent}>
              <div className={classes.navGroup}>
                <MobileLink to="/" icon={IconHome} label="Home" />
                <MobileLink to="/inventory" icon={IconBox} label="Inventory" />
              </div>

              {/* Spacer for FAB */}
              <div style={{ width: 64 }} />

              <div className={classes.navGroup}>
                <MobileLink to="/chores" icon={IconChecklist} label="Tasks" />
                <MobileLink
                  to="/appliances"
                  icon={IconSettings}
                  label="Settings"
                />
              </div>
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

// Extracted NavLinks for reuse
const NavLinks = () => (
  <>
    <Link to="/">
      {({ isActive }: { isActive: boolean }) => (
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
    <Link to="/inventory">
      {({ isActive }: { isActive: boolean }) => (
        <NavLink
          leftSection={<IconFridge size={18} />}
          component="div"
          active={isActive}
          label={
            <Text pt={1} fw={500} size="xs">
              Inventory
            </Text>
          }
        />
      )}
    </Link>
    <Link to="/chores">
      {({ isActive }: { isActive: boolean }) => (
        <NavLink
          leftSection={<IconRotateClockwise2 size={18} />}
          component="div"
          active={isActive}
          label={
            <Text pt={1} fw={500} size="xs">
              Chores
            </Text>
          }
        />
      )}
    </Link>
    <Link to="/appliances">
      {({ isActive }: { isActive: boolean }) => (
        <NavLink
          leftSection={<IconWashMachine size={18} />}
          component="div"
          active={isActive}
          label={
            <Text pt={1} fw={500} size="xs">
              Appliances
            </Text>
          }
        />
      )}
    </Link>
  </>
);

const MobileLink = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: any;
  label: string;
}) => (
  <Link to={to} className={classes.navItem}>
    {({ isActive }: { isActive: boolean }) => {
      const activeClass = isActive ? classes.navItemActive : "";
      const color = isActive ? "#37eb34" : "var(--mantine-color-gray-5)";
      return (
        <>
          <Icon size={24} color={color} stroke={2} />
          <span className={`${classes.navLabel} ${activeClass}`}>{label}</span>
        </>
      );
    }}
  </Link>
);
