import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RestartBotButton from '../../Buttons/RestartBotButton';
import UpdateBotButton from '../../Buttons/UpdateBotButton';
import StopBotButton from '../../Buttons/StopBotButton';
import LogoutButton from '../../Buttons/LogoutButton';
import { useBotInfoContext } from '../../../../context/data/BotInfoProvider';
import { Tooltip } from 'antd';

export default function PowerMenu() {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const botInfo = useBotInfoContext();


    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current?.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Tooltip placement="top"
                title={"Power Menu"}
                arrow={false}>
                <Button
                    aria-controls={open ? 'composition-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    ref={anchorRef}
                >
                    <FontAwesomeIcon icon={faPowerOff} size="lg" />
                </Button>
            </Tooltip>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                >
                                    {botInfo?.can_logout&&<MenuItem onClick={handleClose}><LogoutButton /></MenuItem>}
                                    <MenuItem onClick={handleClose}><RestartBotButton /></MenuItem>
                                    <MenuItem onClick={handleClose}><UpdateBotButton /></MenuItem>
                                    <MenuItem onClick={handleClose}><StopBotButton /></MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}
