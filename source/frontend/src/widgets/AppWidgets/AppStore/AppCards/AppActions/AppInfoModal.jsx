import {InfoCircleOutlined} from "@ant-design/icons";
import AntButton from "../../../../../components/Buttons/AntButton";
import {useState} from "react";
import {Modal} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import AppIconButton from "../../../../../components/Buttons/AppIconButton";

export default function AppInfoModal({app, infoContent}) {
    const [open, setOpen] = useState()
    function handleClose() {
        setOpen(false)
    }
    return infoContent && (<>
        <AppIconButton isSelected={
                app.is_selected
            }
            buttonTitle={
                `${
                    app.categories[0]
                } Info`
            }
            antIconComponent={InfoCircleOutlined}
            onClick={
                () => setOpen(true)
            }/>
        <Modal open={open}
            onCancel={handleClose}
            title={
                `${app.title} | ${app.categories[0]}`
            }
            centered
            width="700px"
            footer={
                [(<AntButton key="back"
                    icon={
                        (<FontAwesomeIcon style={
                                {
                                    margin: "auto",
                                    marginRight: "5px"
                                }
                            }
                            icon={faXmark}/>)
                    }
                    size="large"
                    onClick={handleClose}>
                    Cancel
                </AntButton>),]
        }> {infoContent} </Modal>
    </>)
}
