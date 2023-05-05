import {SelectOutlined} from "@ant-design/icons";
import {ConfirmAction} from "./AppActions";
import { Tooltip } from "antd";
import AppIconButton from "../../../../../components/Buttons/AppIconButton";
import { Trans } from "react-i18next";
import { useState } from "react";

export default function SelectApp({ app, handleSelect,isReadOnlyStrategy }) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const handleOk = () => {
        setConfirmLoading(true);
        handleSelect(() => {
        setOpen(false);
        setConfirmLoading(false);
        });
    };
    if (!app.is_selected) {
        if (isReadOnlyStrategy) {
            return (<Tooltip title={<Trans i18nKey="apps.cantSelectStrategyModeTooltip"/>}>
                <div>
                    
              <AppIconButton isSelected={false}
                buttonTitle={`Select ${app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]}`}
                antIconComponent={SelectOutlined}
                  disabled />
</div>
            </Tooltip>
                )
        } else {
            return (<ConfirmAction antIconComponent={SelectOutlined}
        onConfirm={handleOk}
        open={open}
        confirmTitle={
            `Select ${app.title
            }?`
        }
        confirmButtonText={app?.categoies?.[0] ? `Select ${app.categoies[0]} & Restart Now`: "Select & Restart Now"}
                okButtonProps={{
                    loading: confirmLoading,
                    style: { backgroundColor: "orange" }, icon: (
                        <span>

                            <SelectOutlined size={1} style={{ marginBottom: "5px", marginRight: "5px" }} />
                        </span>
                            )
                }
        }
        buttonTitle={
            `Select ${app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]}`
        }/>)
    }
        }
}
