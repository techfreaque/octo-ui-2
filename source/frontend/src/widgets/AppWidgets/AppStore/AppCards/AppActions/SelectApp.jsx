import {SelectOutlined} from "@ant-design/icons";
import {ConfirmAction} from "./AppActions";

export default function SelectApp({ app, handleSelect }) {
    return (!app.is_selected && (<ConfirmAction antIconComponent={SelectOutlined}
        onConfirm={handleSelect}
        confirmTitle={
            `Select ${app.title
            }?`
        }
        confirmButtonText={app?.categoies?.[0] ? `Select ${app.categoies[0]} & Restart Now`: "Select & Restart Now"}
        okButtonProps={{ style: { backgroundColor: "orange" },icon: (<SelectOutlined size={1}/>) }
        }
        buttonTitle={
            "Select "
                + (
                app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
            )
        }/>))
}
