import {ExportOutlined} from "@ant-design/icons";
import AppIconButton from "../../../../../components/Buttons/AppIconButton";
import {useBotDomainContext} from "../../../../../context/config/BotDomainProvider";

export default function ExportApp({app, exportUrl}) {
    const botDomain = useBotDomainContext()
    return app.is_installed && (
        <AppIconButton isSelected={
                app.is_selected
            }
            buttonTitle={
                app.categories[0] ? `Export ${
                    app.categories[0]
                }` : "Export"
            }
            antIconComponent={ExportOutlined}
            href={
                botDomain + exportUrl
            }/>
    )
}
