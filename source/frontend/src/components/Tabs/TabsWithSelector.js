import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    IconButton,
    Menu,
    Tabs,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";
import "./TabsWithSelector.css";

export default function TabsWithSelector({ children, handleChange, items, currentItem }) {
    return (
        <div style={{ display: "flex", maxWidth: "300px" }}>
            <Tabs
                value={false}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                <ToggleButtonGroup
                    size="medium"
                    value={currentItem}
                    exclusive={true}
                    aria-label="Test"
                >
                    {items.map((item) => (
                        <ToggleButton
                            value={item}
                            key={item}
                            onClick={handleChange}
                        >
                            {item}
                        </ToggleButton>
                    )
                    )}
                </ToggleButtonGroup>
            </Tabs>
            <SelectorMenu>
                {children}
            </SelectorMenu>
        </div>)
}


const ITEM_HEIGHT = 80;

function SelectorMenu({ children }) {
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div style={{ display: "flex" }}>
            <IconButton
                aria-label="more"
                id="timeframes-button"
                aria-controls={open ? "timeframes-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </IconButton>
            <Menu
                id="timeframes-menu"
                MenuListProps={{
                    "aria-labelledby": "timeframes-button",
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
        </div>
    );
}
