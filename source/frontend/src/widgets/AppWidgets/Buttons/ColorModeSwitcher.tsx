import { useMemo } from "react";
import { Trans } from "react-i18next";

import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import Moon from "../../../components/Icons/Moon";
import type { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import {
  colorModes,
  useToggleColorModeContext,
} from "../../../context/config/ColorModeProvider";
import { useColorModeContext } from "../../../context/config/ColorModeProvider";

export default function ColorModeSwitch({
  onClick,
}: UiLayoutPageLayoutType & { onClick?: () => void }) {
  const colorMode = useColorModeContext();
  const colorModeToggle = useToggleColorModeContext();
  return useMemo(() => {
    return (
      <AntButton
        icon={
          colorMode === colorModes.dark ? (
            <Moon height="24px" width="24px" color="white" />
          ) : (
            <Moon height="24px" width="24px" color="black" />
          )
        }
        block={true}
        onClick={() => {
          colorModeToggle.toggleColorMode();
          onClick?.();
        }}
        buttonType={
          colorMode === colorModes.dark ? buttonTypes.white : buttonTypes.black
        }
      >
        <Trans i18nKey="powerMenu.colorModeSwitch" />
      </AntButton>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);
}
