import {useState} from "react";
import AppWidgets from '../../WidgetManagement/RenderAppWidgets';
import IconFromString from '../../../components/Icons/IconFromString';
import {Tooltip, Modal} from 'antd';
import {useBotColorsContext} from '../../../context/config/BotColorsProvider';
import AntButton from '../../../components/Buttons/AntButton';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 1000,
    width: "100%",
    // bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    color: "white",
    p: 4,
    overflowY: "auto",
    maxHeight: "100vh"
};


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
    const id = title?.replace(" ", "-")
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
            id={id}
            handleClose={handleClose}
            content={content}/>
    } </div>);
}

function ModalContent({open, id, handleClose, content}) {
    const botColors = useBotColorsContext()
    return (
    <Modal 
    
        open={open}
        onCancel={handleClose}
        width={1000}
        centered
            footer={null}
            closable={true}
        style={
            {zIndex: "1000"}
        }
        >
        <div  style={
            {
                ...style,
                backgroundColor: botColors?.background,
                maxHeight: "600px", 
                padding: '20px 32px 0 32px'
            }
        }>
            {/* <AntButton onClick={handleClose}
                buttonVariant="text"
                style={
                    {
                        float: "right",
                        zIndex: 100
                    }
                }
                antIcon={"CloseOutlined"}
            ></AntButton> */}
            {
            content && <AppWidgets layout={content}/>
        }
        </div>
    </Modal>)
}
