import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Tab } from "@mui/material";
import { Modal } from "antd";
import { t } from "i18next";
import type { Dispatch, SetStateAction } from "react";
import { Trans } from "react-i18next";

import AntButton, {
  buttonSizes,
} from "../../../../components/Buttons/AntButton";
import { buttonTypes } from "../../../../components/Buttons/AntButton";
import { buttonVariants } from "../../../../components/Buttons/AntButton";
import MuiTabs from "../../../../components/Tabs/MuiTabs";
import type { ProfileType } from "../../../../context/data/BotInfoProvider";
import { TabLabel, tabStyle } from "../../../LayoutWidgets/Tabs/ScrollableTabs";
import ExchangeSelector from "../../ExchangeSelector/ExchangeSelector";
import PairsTable from "../../PairsSelector/PairsTable";
import { ProfileDescription } from "./ProfileDescription";
import { ProfileRealSettings } from "./ProfileRealTradingSettings";
import { ProfileSimulatedSettings } from "./ProfileSimulatedTradingSettings";
import { ProfileTitle } from "./ProfileTitle";
import {
  ProfileReferenceMarketSettings,
  ProfileTradingTypeSettings,
} from "./ProfileTradingSettings";

export default function ProfileModal({
  isCurrentProfile,
  handleClose,
  newProfileSettings,
  setNewProfileSettings,
  profile,
  setRequiresInstantRestart,
  requiresInstantRestart,
  loading,
  saveProfile,
  hasChanged,
  saveProfileAndRestart,
}: {
  isCurrentProfile: boolean | undefined;
  handleClose: () => void;
  newProfileSettings: ProfileType;
  setNewProfileSettings: Dispatch<SetStateAction<ProfileType>>;
  profile: ProfileType;
  setRequiresInstantRestart: Dispatch<SetStateAction<boolean>>;
  requiresInstantRestart: boolean;
  loading: boolean;
  saveProfile: (restart?: boolean) => Promise<void>;
  hasChanged: boolean;
  saveProfileAndRestart: () => void;
}) {
  const tabsData = [
    {
      tabId: 0,
      title: (
        <Tab
          key={0}
          label={
            <TabLabel
              key={0}
              tabTitle={t("strategyConfigurator.profileSettings.strategy-info")}
              antIcon={"ProfileOutlined"}
            />
          }
          value={0}
          sx={tabStyle}
        />
      ),
      dontScroll: true,
      content: (
        <>
          <ProfileDescription
            newProfileSettings={newProfileSettings}
            setNewProfileSettings={setNewProfileSettings}
          />
          <ProfileTradingTypeSettings
            newProfileSettings={newProfileSettings}
            isCurrentProfile={isCurrentProfile}
            setNewProfileSettings={setNewProfileSettings}
          />
        </>
      ),
    },
    {
      tabId: 1,
      title: (
        <Tab
          key={1}
          label={
            <TabLabel
              key={1}
              tabTitle={t(
                "strategyConfigurator.profileSettings.simulation-settings",
              )}
              antIcon={"RobotOutlined"}
            />
          }
          value={1}
          sx={tabStyle}
        />
      ),
      dontScroll: false,
      content: (
        <ProfileSimulatedSettings
          newProfileSettings={newProfileSettings}
          isCurrentProfile={isCurrentProfile}
          setNewProfileSettings={setNewProfileSettings}
        />
      ),
    },
  ];
  isCurrentProfile &&
    tabsData.push(
      {
        tabId: 2,
        title: (
          <Tab
            key={2}
            label={
              <TabLabel
                key={2}
                tabTitle={t(
                  "strategyConfigurator.profileSettings.traded-pairs",
                )}
                antIcon={"DollarCircleOutlined"}
              />
            }
            value={2}
            sx={tabStyle}
          />
        ),
        dontScroll: true,
        content: (
          <>
            <ProfileReferenceMarketSettings
              newProfileSettings={newProfileSettings}
              isCurrentProfile={isCurrentProfile}
              setNewProfileSettings={setNewProfileSettings}
            />
            <PairsTable />
          </>
        ),
      },
      {
        tabId: 3,
        title: (
          <Tab
            key={3}
            label={
              <TabLabel
                key={3}
                tabTitle={t("strategyConfigurator.profileSettings.exchanges")}
                antIcon={"BankOutlined"}
              />
            }
            value={3}
            sx={tabStyle}
          />
        ),
        dontScroll: true,
        content: (
          <>
            <ProfileRealSettings
              newProfileSettings={newProfileSettings}
              isCurrentProfile={isCurrentProfile}
              setNewProfileSettings={setNewProfileSettings}
            />
            <ExchangeSelector />
          </>
        ),
      },
    );
  return (
    <Modal
      open={true}
      onCancel={handleClose}
      title={
        <ProfileTitle
          newProfileSettings={newProfileSettings}
          isCurrentProfile={isCurrentProfile}
          setNewProfileSettings={setNewProfileSettings}
          currentProfile={profile}
          setRequiresInstantRestart={setRequiresInstantRestart}
        />
      }
      centered
      width="700px"
      styles={{ body: { display: "flex" } }}
      footer={[
        <div key={"profile"} style={{ display: "flex" }}>
          <div>
            <AntButton
              key="back"
              antIconComponent={CloseOutlined}
              size={buttonSizes.large}
              onClick={handleClose}
            >
              <Trans i18nKey="strategyConfigurator.profileSettings.cancel" />
            </AntButton>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
            }}
          >
            {!requiresInstantRestart && isCurrentProfile && (
              <AntButton
                disabled={!hasChanged || loading}
                key="save2"
                antIconComponent={SaveOutlined}
                buttonVariant={buttonVariants.primary}
                buttonType={buttonTypes.warning}
                size={buttonSizes.large}
                onClick={() => saveProfile()}
              >
                <Trans i18nKey="strategyConfigurator.profileSettings.save-and-restart-later" />
              </AntButton>
            )}
            {isCurrentProfile && (
              <AntButton
                disabled={!hasChanged || loading}
                key="saveAndRestart"
                buttonVariant={buttonVariants.primary}
                antIconComponent={SaveOutlined}
                buttonType={buttonTypes.error}
                size={buttonSizes.large}
                onClick={saveProfileAndRestart}
              >
                <Trans i18nKey="strategyConfigurator.profileSettings.save-and-restart-now" />
              </AntButton>
            )}
          </div>
        </div>,
      ]}
    >
      <div>
        <MuiTabs tabs={tabsData} defaultTabId={0} />
      </div>
    </Modal>
  );
}
