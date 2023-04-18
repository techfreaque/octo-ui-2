import {useState} from "react";
import AppWidgets from '../../WidgetManagement/RenderAppWidgets';
import IconFromString from '../../../components/Icons/IconFromString';
import {Tooltip, Modal} from 'antd';
import AntButton from '../../../components/Buttons/AntButton';


export default function ButtonWithModal({
    title,
    content,
    antIcon,
    faIcon,
    iconOnly
}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (<div style={
        {
            margin: "auto",
            height: "100%"
        }
    }>
        <Tooltip placement="top"
            title={title}
            arrow={false}>
            <div>
                <AntButton onClick={handleOpen}
                    buttonVariant="text">
                    <IconFromString faIcon={faIcon}
                        antIcon={antIcon}
                        marginRight={"0px"}/> {
                    !iconOnly && title
                } </AntButton>
            </div>
        </Tooltip>
        {
        open && <ModalContent open={open}
            handleClose={handleClose}
            content={content}/>
    } </div>);
}

function ModalContent({open, handleClose, content}) {
    return (
        <Modal 
            open={open}
            onCancel={handleClose}
            width={1000}
            centered
            footer={null}
            closable={true}
            // closable={false}
            keyboard
            zIndex={1000}
            >
            <div  style={
                {
                    padding: '20px 32px 0 32px'

                }
            }>
                {
                content && <AppWidgets layout={content}/>
            }
            </div>
        </Modal>)
}
