import { Dropdown, Tooltip } from "antd";
import type { Dispatch, SetStateAction} from "react";
import { useMemo } from "react";
import { Trans } from "react-i18next";

import AntButton from "../../../components/Buttons/AntButton";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import type { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import { useVisibleExchangesContext } from "../../../context/config/VisibleExchangesProvider";
import { useVisiblePairsContext } from "../../../context/config/VisiblePairProvider";
import type {
  PairSelectorMenuOpenType} from "../../../context/data/BotExchangeInfoProvider";
import {
  usePairSelectorMenuOpenContext,
  useUpdatePairSelectorMenuOpenContext,
} from "../../../context/data/BotExchangeInfoProvider";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";

export default function PairsSelector({ content }: UiLayoutPageLayoutType) {
  const visiblePairs = useVisiblePairsContext();
  const visibleExchanges = useVisibleExchangesContext();
  const menuIsOpen = usePairSelectorMenuOpenContext();
  const setMenuIsOpen = useUpdatePairSelectorMenuOpenContext();
  return useMemo(() => {
    return (
      <div style={{ marginTop: "auto", marginBottom: "auto" }}>
        <PairConfiguratorDropdown
          setMenuIsOpen={setMenuIsOpen}
          menuIsOpen={menuIsOpen?.open}
          content={content}
        >
          <Tooltip
            key={visiblePairs}
            title={<Trans i18nKey="pairExchangeSettings.currentPairTooltip" />}
          >
            <div>
              <AntButton
                selected={true}
                onClick={() => setMenuIsOpen({ open: true, wantsClose: false })}
                buttonVariant="text"
              >
                <div>
                  <div style={{ lineHeight: "16px" }}> {visiblePairs} </div>
                  <div style={{ lineHeight: "15px" }}> {visibleExchanges} </div>
                </div>
              </AntButton>
            </div>
          </Tooltip>
        </PairConfiguratorDropdown>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, menuIsOpen?.open, visibleExchanges, visiblePairs]);
}

function PairConfiguratorDropdown({
  content,
  setMenuIsOpen,
  menuIsOpen,
  children,
}: {
  content: UiLayoutPageLayoutType[] | undefined;
  setMenuIsOpen: Dispatch<SetStateAction<PairSelectorMenuOpenType>>;
  menuIsOpen: boolean;
  children: JSX.Element;
}) {
  return (
    <Dropdown
      onOpenChange={(open) => setMenuIsOpen({ open, wantsClose: true })}
      open={menuIsOpen}
      destroyPopupOnHide={true}
      dropdownRender={() => {
        return <PairConfigurator content={content} />;
      }}
      trigger={["click"]}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      {children}
    </Dropdown>
  );
}

function PairConfigurator({
  content,
}: {
  content: UiLayoutPageLayoutType[] | undefined;
}) {
  const botColors = useBotColorsContext();
  return (
    <div
      style={{
        backgroundColor: botColors.background,
        border: `1px solid ${botColors.border}`,
      }}
    >
      {content && <AppWidgets layout={content} />}
    </div>
  );
}
