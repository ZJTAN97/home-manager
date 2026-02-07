import { AppShell, Flex, NavLink, Text, Group, Switch, useMantineColorScheme, useMantineTheme, rem, ActionIcon } from "@mantine/core";
import { IconLayoutDashboard, IconFridge, IconRotateClockwise2, IconWashMachine, IconSun, IconMoonStars } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo/Logo";
import classes from "./LayoutShell.module.css";

function ThemeToggle({ compact }: { compact?: boolean }) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const toggle = () => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');

  if (compact) {
      return (
          <ActionIcon onClick={toggle} variant="subtle" color="gray" size="lg">
              {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoonStars size={20} />}
          </ActionIcon>
      )
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
    <Group justify="center" p="md" style={{ borderTop: `1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))` }}>
      <Switch
        size="md"
        color="dark.4"
        onLabel={sunIcon}
        offLabel={moonIcon}
        checked={colorScheme === 'auto' ? false : colorScheme === 'dark'} 
        onChange={(event) => setColorScheme(event.currentTarget.checked ? 'dark' : 'light')}
      />
    </Group>
  );
}

export const LayoutShell = ({ children }: { children: ReactNode }) => {
  // Configured collapsed state directly in navbar prop

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
          <div className={classes.mobileNav} hidden={false}>
             <MobileNavLinks />
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
        {({ isActive }) => (
          <NavLink
            leftSection={<IconLayoutDashboard size={18} />}
            component="div"
            active={isActive}
            label={
              <Text pt={1} fw={500} size="xs">Overview</Text>
            }
          />
        )}
      </Link>
      <Link to="/expiry">
        {({ isActive }) => (
          <NavLink
            leftSection={<IconFridge size={18} />}
            component="div"
            active={isActive}
            label={
              <Text pt={1} fw={500} size="xs">Expiry</Text>
            }
          />
        )}
      </Link>
      <Link to="/chores">
        {({ isActive }) => (
          <NavLink
            leftSection={<IconRotateClockwise2 size={18} />}
            component="div"
            active={isActive}
            label={
              <Text pt={1} fw={500} size="xs">Chores</Text>
            }
          />
        )}
      </Link>
      <Link to="/appliances">
        {({ isActive }) => (
          <NavLink
            leftSection={<IconWashMachine size={18} />}
            component="div"
            active={isActive}
            label={
              <Text pt={1} fw={500} size="xs">Appliances</Text>
            }
          />
        )}
      </Link>
    </>
);

const MobileNavLinks = () => (
    <>
      <MobileLink to="/" icon={IconLayoutDashboard} label="Home" />
      <MobileLink to="/expiry" icon={IconFridge} label="Expiry" />
      <MobileLink to="/chores" icon={IconRotateClockwise2} label="Chores" />
      <MobileLink to="/appliances" icon={IconWashMachine} label="Maint." />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ThemeToggle compact />
      </div>
    </>
);

const MobileLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link to={to} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 4 }}>
        {({ isActive }) => {
             const color = isActive ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-gray-5)';
             return (
                <>
                    <Icon size={24} color={color} />
                    <Text size="10px" c={isActive ? 'primary' : 'dimmed'} fw={600}>{label}</Text>
                </>
             )
        }}
    </Link>
);
