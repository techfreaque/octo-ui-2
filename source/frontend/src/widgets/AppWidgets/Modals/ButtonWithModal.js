import {useState} from "react";
import AppWidgets from '../../WidgetManagement/RenderAppWidgets';
import IconFromString from '../../../components/Icons/IconFromString';
import {Tooltip, Modal, Avatar} from 'antd';
import AntButton from '../../../components/Buttons/AntButton';

export default function ButtonWithModal({
    title,
    content,
    antIcon,
    faIcon,
    iconOnly,
    displayAsAvatar,
    width,
    open,
    setOpen
}) {
    const [_open, _setOpen] = useState(false);
    const actualOpen = open || _open
    const actualSetOpen = setOpen || _setOpen
    const handleOpen = () => actualSetOpen(true);
    const handleClose = () => actualSetOpen(false);
    return (
        <div style={
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
                        {
                        displayAsAvatar ? (
                            <>
                                <Avatar onClick={handleOpen}
                                    style={
                                        {margin: "auto"}
                                    }
                                    size="small"
                                    icon={
                                        (
                                            <IconFromString faIcon={faIcon}
                                                antIcon={antIcon}
                                                marginRight={"0px"}/>
                                        )
                                    }/> {
                                !iconOnly && title
                            } </>
                        ) : (
                            <IconFromString faIcon={faIcon}
                                antIcon={antIcon}
                                marginRight={"0px"}/>
                        )
                    }
                        {
                        !iconOnly && title
                    } </AntButton>
                </div>
            </Tooltip>
            {
            actualOpen && (
                <ModalContent open={actualOpen}
                    width={width}
                    handleClose={handleClose}
                    content={content}/>
            )
        } </div>
    );
}

function ModalContent({
    open,
    handleClose,
    content,
    width = 1000
}) {
    return (
        <Modal open={open}
            onCancel={handleClose}
            width={width}
            centered
            footer={null}
            closable={true}
            // closable={false}
            keyboard
            zIndex={1000}>
            <div style={
                {padding: '20px 32px 0 32px'}
            }>
                {
                content && (
                    <AppWidgets layout={content}/>
                )
            } </div>
        </Modal>
    )
}
