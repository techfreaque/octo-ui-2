import {SelectOutlined} from "@ant-design/icons";
import {ConfirmAction} from "./AppActions";
import {Tooltip} from "antd";
import AppIconButton from "../../../../../components/Buttons/AppIconButton";
import {Trans} from "react-i18next";
import {useState} from "react";

export default function SelectApp({app, handleSelect, isReadOnlyStrategy}) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const handleOk = () => {
        setConfirmLoading(true);
        handleSelect(() => {
            setOpen(false);
            setConfirmLoading(false);
        });
    };
    if (!app.is_selected && handleSelect) {
        const okButtonProps = {
            loading: confirmLoading,
            style: {
                backgroundColor: "orange"
            },
            icon: (<span>

                <SelectOutlined size={1}
                    style={
                        {
                            marginBottom: "5px",
                            marginRight: "5px"
                        }
                    }/>
            </span>)
        }
        const buttonTitle = `Select ${
            app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
        }`
        return isReadOnlyStrategy ? (<Tooltip title={
            <Trans
            i18nKey="apps.cantSelectStrategyModeTooltip"/>
        }>
            <div>

                <AppIconButton isSelected={false}
                    buttonTitle={buttonTitle}
                    antIconComponent={SelectOutlined}
                    disabled/>
            </div>
        </Tooltip>) : (<ConfirmAction antIconComponent={SelectOutlined}
            onConfirm={handleOk}
            open={open}
            confirmTitle={
                `Select ${
                    app.title
                }?`
            }
            okButtonProps={okButtonProps}
            confirmButtonText={
                app?.categoies?.[0] ? `Select ${
                    app.categoies[0]
                } & Restart Now` : "Select & Restart Now"
            }

            buttonTitle={buttonTitle}/>);
    }
    return (<></>)

}
