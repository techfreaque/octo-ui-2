import {InfoCircleOutlined} from "@ant-design/icons";
import AntButton from "../../../../../components/Buttons/AntButton";
import {useState} from "react";
import {Modal} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

export default function AppInfoModal({app, infoContent}) {
    const [open, setOpen] = useState()
    function handleClose() {
        setOpen(false)
    }
    return (<>
        <AntButton onClick={
                () => setOpen(true)
            }
            antIconComponent={InfoCircleOutlined}
            style={
                {margin: "3px"}
            }
            buttonVariant="text"> {
            `${
                app.categories[0]
            } Info`
        }</AntButton>


        <Modal open={open}
            onCancel={handleClose}
            title={
                app.title + " | " + app.categories[0]
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
