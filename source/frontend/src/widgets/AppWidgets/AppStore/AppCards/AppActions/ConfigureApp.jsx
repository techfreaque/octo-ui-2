import {BranchesOutlined} from "@ant-design/icons";
import AppIconButton from "../../../../../components/Buttons/AppIconButton";

export default function ConfigureApp({app, onConfigure}) {
    return app.is_selected && (<AppIconButton //  isSelected={isSelected}
        buttonTitle={
            `Configure ${
                app.categories[0]
            }`
        }
        antIconComponent={BranchesOutlined}
        onClick={onConfigure}/>)
}
