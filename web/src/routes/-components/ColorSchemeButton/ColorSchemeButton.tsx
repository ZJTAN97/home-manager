import {
  useMantineColorScheme,
  useComputedColorScheme,
  Button,
  ActionIcon,
} from "@mantine/core";
import { IconSunElectricity } from "@tabler/icons-react";

export const ColorSchemeButton = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light"); // default is light

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  return (
    <ActionIcon onClick={toggleColorScheme} variant="transparent">
      <IconSunElectricity />
    </ActionIcon>
  );
};
