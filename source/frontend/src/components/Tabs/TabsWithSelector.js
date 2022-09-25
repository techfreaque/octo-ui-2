import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    IconButton,
    Menu,
    Tab,
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
                value="0"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                <Tab value="0" style={{ minWidth: 0, paddingLeft: 0, paddingRight: 0 }} />
                <ToggleButtonGroup
                    size="medium"
                    value={currentItem}
                    exclusive={true}
                    aria-label={items}
                    style={{ marginRight: "10px"}}
                >
                    {items.map((item) => (
                        <ToggleButton
                            value={item}
                            key={item}
                            onClick={handleChange}
                            style={{ height: "40px", margin: "auto"}}
                        >
                            {item}
                        </ToggleButton>
                    )
                    )}
                    <SelectorMenu>
                        {children}
                    </SelectorMenu>
                </ToggleButtonGroup>
            </Tabs>

        </div>)
}

const ITEM_HEIGHT = 40;

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
        <ToggleButton value={"selector"} style={{ height: "40px", margin: "auto"}}>
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
        </ToggleButton>
    );
}
