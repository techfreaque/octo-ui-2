import { Modal } from "antd";
import { ProfileTitle } from "./ProfileTitle";
import AntButton, {
  buttonSizes,
} from "../../../../components/Buttons/AntButton";
import { SaveOutlined } from "@ant-design/icons";
import MuiTabs from "../../../../components/Tabs/MuiTabs";
import { TabLabel, tabStyle } from "../../../LayoutWidgets/Tabs/ScrollableTabs";
import { Tab } from "@mui/material";
import PairsTable from "../../PairsSelector/PairsTable";
import ExchangeSelector from "../../ExchangeSelector/ExchangeSelector";
import { ProfileDescription } from "./ProfileDescription";
import {
  ProfileReferenceMarketSettings,
  ProfileTradingTypeSettings,
} from "./ProfileTradingSettings";
import { ProfileRealSettings } from "./ProfileRealTradingSettings";
import { ProfileSimulatedSettings } from "./ProfileSimulatedTradingSettings";
import { sizes } from "../../../../constants/frontendConstants";
import { buttonTypes } from "../../../../components/Buttons/AntButton";
import { CancelOutlined } from "@mui/icons-material";
import { buttonVariants } from "../../../../components/Buttons/AntButton";

export default function ProfileModal({
  open,
  isCurrentProfile,
  setIsloading,
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
              tabTitle={"Strategy Info"}
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
            isCurrentProfile={isCurrentProfile}
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
              tabTitle={"Simulation Settings"}
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
                tabTitle={"Traded Pairs"}
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
                tabTitle={"Exchanges"}
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
      }
    );
  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={
        <ProfileTitle
          newProfileSettings={newProfileSettings}
          isCurrentProfile={isCurrentProfile}
          setNewProfileSettings={setNewProfileSettings}
          currentProfile={profile || {}}
          setRequiresInstantRestart={setRequiresInstantRestart}
        />
      }
      centered
      width="700px"
      bodyStyle={{ display: "flex" }}
      footer={[
        <div key={"profile"} style={{ display: "flex" }}>
          <div>
            <AntButton
              key="back"
              muiIconComponent={CancelOutlined}
              size={buttonSizes.large}
              onClick={handleClose}
            >
              Cancel
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
                onClick={saveProfile}
              >
                Save And Restart Later
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
                Save And Restart Now
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
