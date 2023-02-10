import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Menu,
    Tabs,
    ToggleButton,
    ToggleButtonGroup,
    useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import "./TabsWithSelector.css";

export default function TabsWithSelector({ children, handleChange, items, currentItem, id, onClose }) {
    // todo replace - works but logs errors
    const isBigScreen = useMediaQuery('(min-width:1100px)');
    const isMediumScreen = useMediaQuery('(min-width:900px)');
    const isSmallScreen = useMediaQuery('(min-width:630px)');
    let maxWidth = "22vw"
    if (isBigScreen) {
        maxWidth = "27vw"
    } else if (isMediumScreen) {
        maxWidth = "23vw"

    } else if (isSmallScreen) {
        maxWidth = "24vw"

    }
    let itemsList = items
    if (typeof items === 'string') {
        itemsList = [items]
    }
    return (
        <div style={{
            display: "flex",
            maxWidth: maxWidth,
        }} >
            <Tabs
                value="0"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                <ToggleButtonGroup
                    size="small"
                    value={currentItem}
                    exclusive={true}
                    aria-label={itemsList}
                    style={{
                        marginRight: "10px",

                    }}
                >
                    {itemsList.map((item) => (
                        <ToggleButton
                            value={item}
                            key={item}
                            onClick={handleChange}
                            style={{ height: "40px", margin: "auto" }}
                        >
                            {item}
                        </ToggleButton>
                    )
                    )}
                    <SelectorMenu id={id} onClose={onClose}>
                        {children}
                    </SelectorMenu>
                </ToggleButtonGroup>
            </Tabs>

        </div>)
}

const ITEM_HEIGHT = 80;

function SelectorMenu({ children, id, onClose }) {
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        onClose();
    };
    return (
        <>
            <ToggleButton
                onClick={handleClick}
                aria-label="more"
                id={id + "-selector-more-button"}
                aria-controls={open ? id + "selector-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                style={{ height: "40px", margin: "auto" }}
                value="selector"
            >
                <FontAwesomeIcon icon={faEllipsisVertical} size="xl" />
            </ToggleButton>
            <Menu
                id={id + "selector-menu"}
                MenuListProps={{
                    "aria-labelledby": id + "-selector-more-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                    },
                }}
            >
                {children}
            </Menu>
        </>
    );
}
