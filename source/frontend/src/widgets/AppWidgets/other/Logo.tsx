import { Tooltip } from "antd";
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
        <Tooltip title={"Click to learn more about Octane"}>
          <img
            onClick={() => setProjectInfoOpen(true)}
            height={"28px"}
            style={{ cursor: "pointer" }}
            alt="Octane Logo"
            src={logo}
          />
        </Tooltip>
      </div>
    </div>
  );
}
