import {BranchesOutlined} from "@ant-design/icons";
import AntButton from "../../../../../components/Buttons/AntButton";

export default function ConfigureApp({app, onConfigure}) {
    return app.is_selected && (<AntButton style={
            {margin: "3px"}
        }
        antIconComponent={BranchesOutlined}
        onClick={onConfigure}
        buttonVariant="text"> {
        `Configure ${
            app.categories[0]
        }`
    } </AntButton>)

}
