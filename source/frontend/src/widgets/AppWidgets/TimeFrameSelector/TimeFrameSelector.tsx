import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSaveTentaclesConfig } from "../../../context/config/TentaclesConfigProvider";
import {
  useUpdateVisibleTimeFramesContext,
  useVisibleTimeFramesContext,
} from "../../../context/config/VisibleTimeFrameProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";
import { Button, Dropdown, List, Switch, Typography } from "antd";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { AntIconByReactFunc } from "../../../components/Icons/AntIcon";
import { CaretDownOutlined } from "@ant-design/icons";
import { sizes } from "../../../constants/frontendConstants";
import RadioButtonGroup from "../../../components/Buttons/RadioButtonGroup";
import createNotification from "../../../components/Notifications/Notification";
import RestartBotButton from "../Buttons/RestartBotButton";
import { buttonTypes } from "../../../components/Buttons/AntButton";

export default function TimeFrameSelector() {
  const botInfo = useBotInfoContext();
  const visibleTimeframes = useVisibleTimeFramesContext();
  const setVisibleTimeframes = useUpdateVisibleTimeFramesContext();
  const [enabledTimeFrame, setEnabledTimeFrame] = useState(
    botInfo?.traded_time_frames || []
  );
  useEffect(() => {
    if (botInfo?.traded_time_frames) {
      setEnabledTimeFrame(botInfo.traded_time_frames);
    }
  }, [botInfo?.traded_time_frames]);

  const handleChange = (newTimeFrame: string) => {
    setVisibleTimeframes(newTimeFrame);
  };

  return (
    botInfo?.strategy_names &&
    botInfo?.time_frames?.length && (
      <RadioButtonGroup
        rightContent={
          <TimeFrameEnabler
            enabledTimeFrame={enabledTimeFrame}
            setEnabledTimeFrame={setEnabledTimeFrame}
          />
        }
        menuItems={botInfo.traded_time_frames.map((time_frame) => ({
          label: time_frame,
          key: time_frame,
        }))}
        onChange={handleChange}
        selected={visibleTimeframes}
      />
    )
  );
}

function TimeFrameEnabler({
  enabledTimeFrame,
  setEnabledTimeFrame,
}: {
  enabledTimeFrame: string[];
  setEnabledTimeFrame: Dispatch<SetStateAction<string[]>>;
}) {
  const botInfo = useBotInfoContext();
  const botColors = useBotColorsContext();
  const saveTentaclesConfig = useSaveTentaclesConfig();
  function handleTimeFrameChange(timeFrame: string) {
    const newTimeframes = enabledTimeFrame.includes(timeFrame)
      ? enabledTimeFrame.filter(
          (foundTimeframe) => foundTimeframe !== timeFrame
        )
      : [...enabledTimeFrame, timeFrame];
    setEnabledTimeFrame(newTimeframes);
  }

  function saveTimeFrameSettings() {
    const hasChanged =
      JSON.stringify(enabledTimeFrame) !==
      JSON.stringify(botInfo?.traded_time_frames);
    function onSaveFinished() {
      createNotification({
        title: "Pending restart",
        type: "warning",
        message: (
          <>
            The newly selected time frames will be available after a restart
            <RestartBotButton buttonType={buttonTypes.black} />
          </>
        ),
        duration: 9_999_999_999_999,
        dismiss: false,
      });
    }
    hasChanged &&
      botInfo?.strategy_names &&
      saveTentaclesConfig(
        {
          [botInfo.strategy_names[0]]: {
            required_time_frames: enabledTimeFrame,
          },
        },
        onSaveFinished,
        false,
        true
      );
  }
  const items = botInfo?.time_frames?.map((time_frame) => {
    return {
      key: time_frame,
      disabled: true,
      label: time_frame,
      isActive: enabledTimeFrame?.includes(time_frame),
    };
  });
  return items ? (
    <Dropdown
      onOpenChange={(open) => !open && saveTimeFrameSettings()}
      menu={{
        // triggerSubMenuAction: "hover",
        items,
      }}
      dropdownRender={(event) => {
        return (
          <div>
            <List
              bordered
              dataSource={items}
              style={{
                maxHeight: "calc(100vh - 90px",
                overflowY: "auto",
                // bottom: 0,
                // top: "unset",
                backgroundColor: botColors?.background,
              }}
              renderItem={(item) =>
                item ? (
                  <List.Item
                    key={item.label}
                    onClick={() => handleTimeFrameChange(item.label)}
                    style={
                      item.isActive
                        ? {
                            backgroundColor: botColors?.backgroundActive,
                          }
                        : {}
                    }
                  >
                    <Typography.Text> {item.label}</Typography.Text>
                    <span
                      style={{
                        float: "right",
                        marginLeft: "10px",
                      }}
                    >
                      <Switch
                        checked={item.isActive}
                        onChange={() => handleTimeFrameChange(item.label)}
                      />
                    </span>
                  </List.Item>
                ) : (
                  <></>
                )
              }
            />
          </div>
        );
      }}
      // selectable={false}
      // multiple={true}
      trigger={["click"]}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <Button
        style={{
          padding: "0px 4px",
          margin: "auto",
        }}
        type={"text"}
      >
        <span
          style={{
            display: "flex",
          }}
        >
          <AntIconByReactFunc
            size={sizes.extraSmall}
            AntReactIcon={CaretDownOutlined}
          />
        </span>
      </Button>
    </Dropdown>
  ) : (
    <></>
  );
}
