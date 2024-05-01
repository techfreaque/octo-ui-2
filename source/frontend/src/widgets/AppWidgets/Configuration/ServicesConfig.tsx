import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { useBotDomainContext } from "../../../context/config/BotDomainProvider";

export default function ServicesConfig() {
  const botDomain = useBotDomainContext();
  const botColors = useBotColorsContext();
  return (
    <iframe
      title="account-settings"
      src={`${botDomain}/account-settings`}
      style={{
        background: botColors?.background,
        color: botColors?.font,
      }}
      // crossorigin="anonymous"
      height={"100%"}
      width="100%"
      sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation"
    />
  );
}
