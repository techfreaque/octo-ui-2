import { Tooltip } from "antd";
import { t } from "i18next";

import { projectName } from "../../../constants/frontendConstants";
import { useUpdateProjectInfoOpenContext } from "../../../context/data/BotInfoProvider";
import logo from "./octane-logo.png";

export default function Logo() {
  const setProjectInfoOpen = useUpdateProjectInfoOpenContext();

  return (
    <div
      style={{
        marginTop: "auto",
        marginBottom: "auto",
      }}
    >
      <div
        style={{
          margin: "0px 5px",
        }}
      >
        <Tooltip title={t("projectLogo.tooltip", { projectName })}>
          <img
            onClick={() => setProjectInfoOpen(true)}
            height={"28px"}
            style={{ cursor: "pointer" }}
            alt={t("projectLogo.projectname-logo", { projectName })}
            src={logo}
          />
        </Tooltip>
      </div>
    </div>
  );
}
