import { useVisiblePairsContext } from "../../../context/config/VisiblePairProvider";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Dropdown, Tooltip } from "antd";
import { Trans } from "react-i18next";
import { useVisibleExchangesContext } from "../../../context/config/VisibleExchangesProvider";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import AntButton from "../../../components/Buttons/AntButton";
import AppWidgets from "../../WidgetManagement/RenderAppWidgets";
import {
  PairSelectorMenuOpenType,
  usePairSelectorMenuOpenContext,
  useUpdatePairSelectorMenuOpenContext,
} from "../../../context/data/BotExchangeInfoProvider";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";

export default function PairsSelector({ content }: UiLayoutPageLayoutType) {
  const visiblePairs = useVisiblePairsContext();
  const visibleExchanges = useVisibleExchangesContext();
  const menuIsOpen = usePairSelectorMenuOpenContext();
  const setMenuIsOpen = useUpdatePairSelectorMenuOpenContext();
  return useMemo(() => {
    return (
      <div style={{ margin: "auto" }}>
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
