import * as React from 'react';
import {faPowerOff} from '@fortawesome/free-solid-svg-icons';
import RestartBotButton from '../../Buttons/RestartBotButton';
import UpdateBotButton from '../../Buttons/UpdateBotButton';
import StopBotButton from '../../Buttons/StopBotButton';
import LogoutButton from '../../Buttons/LogoutButton';
import {useBotInfoContext} from '../../../../context/data/BotInfoProvider';
import {Dropdown, Tooltip, Button} from 'antd';
import {FaIconByReactFunc} from '../../../../components/Icons/FontAwesome';
import {sizes} from '../../../../constants/frontendConstants';
import {useBotDomainContext} from '../../../../context/config/BotDomainProvider';
import {MuiIconButton} from '../../../../components/Buttons/IconButton';

export default function PowerMenu() {
    const botInfo = useBotInfoContext();
    const botDomain = useBotDomainContext();
    return (
        <Dropdown menu={
                {
                    items: [
                        {
                            key: 'logout',
                            label: (
                                <LogoutButton/>)
                        },
                        {
                            key: 'restart',
                            label: (
                                <RestartBotButton/>)
                        },
                        {
                            key: 'update',
                            label: (
                                <UpdateBotButton/>)
                        },
                        {
                            key: 'stop',
                            label: (
                                <StopBotButton/>)
                        }, {
                            key: 'back',
                            label: (
                                <Button variant="outlined"
                                    href={botDomain}>Back to OctoBot</Button>
                            )
                        },
                    ]
                }
            }
            overlayStyle={
                {minWidth: "230px"}
            }
            trigger="click"
            placement="topRight"
            arrow>
            <Tooltip placement="topRight"
                title={"Power Menu"}
                arrow={false}>
                <div>
                    <MuiIconButton><FaIconByReactFunc icon={faPowerOff}
                            size={
                                sizes.medium
                            }/></MuiIconButton>
                </div>
            </Tooltip>
        </Dropdown>
    )
}
// export default function PowerMenu1() {
//     const [open, setOpen] = React.useState(false);
//     const anchorRef = React.useRef(null);
//     const botInfo = useBotInfoContext();
//     const botDomain = useBotDomainContext();
//     const handleToggle = () => {
//         setOpen((prevOpen) => !prevOpen);
//     };
//     const handleClose = (event) => {
//         if (anchorRef.current ?. contains(event.target)) {
//             return;
//         }

//         setOpen(false);
//     };
//     function handleListKeyDown(event) {
//         if (event.key === 'Tab') {
//             event.preventDefault();
//             setOpen(false);
//         } else if (event.key === 'Escape') {
//             setOpen(false);
//         }
//     }
//     // return focus to the button when we transitioned from !open -> open
//     const prevOpen = React.useRef(open);
//     React.useEffect(() => {
//         if (prevOpen.current === true && open === false) {
//             anchorRef.current.focus();
//         }

//         prevOpen.current = open;
//     }, [open]);
//     return (
//         <>
//             <Tooltip placement="top"
//                 title={"Power Menu"}
//                 arrow={false}>
//                 <Button aria-controls={
//                         open ? 'composition-menu' : undefined
//                     }
//                     aria-expanded={
//                         open ? 'true' : undefined
//                     }
//                     aria-haspopup="true"
//                     onClick={handleToggle}
//                     ref={anchorRef}>
//                     <FaIconByReactFunc icon={faPowerOff}
//                         size={
//                             sizes.medium
//                         }/>
//                 </Button>
//             </Tooltip>
//             <Popper open={open}
//                 anchorEl={
//                     anchorRef.current
//                 }
//                 role={undefined}
//                 placement="bottom-start"
//                 transition
//                 disablePortal>
//                 {
//                 ({TransitionProps, placement}) => (
//                     <Grow {...TransitionProps}
//                         style={
//                             {
//                                 transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom'
//                             }
//                     }>
//                         <Paper>
//                             <ClickAwayListener onClickAway={handleClose}>
//                                 <MenuList autoFocusItem={open}
//                                     id="composition-menu"
//                                     aria-labelledby="composition-button"
//                                     onKeyDown={handleListKeyDown}>
//                                     {
//                                     botInfo ?. can_logout && (
//                                         <MenuItem onClick={handleClose}><LogoutButton/></MenuItem>
//                                     )
//                                 }
//                                     <MenuItem href={botDomain}><RestartBotButton/></MenuItem>
//                                     <MenuItem onClick={handleClose}><RestartBotButton/></MenuItem>
//                                     <MenuItem onClick={handleClose}><UpdateBotButton/></MenuItem>
//                                     <MenuItem onClick={handleClose}><StopBotButton/></MenuItem>
//                                 </MenuList>
//                             </ClickAwayListener>
//                         </Paper>
//                     </Grow>
//                 )
//             } </Popper>
//         </>
//     );
// }
