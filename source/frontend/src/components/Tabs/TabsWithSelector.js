import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Menu,
    Tab,
    Tabs,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";
import "./TabsWithSelector.css";

export default function TabsWithSelector({ children, handleChange, items, currentItem, id, onClose }) {
    // todo replace - works but logs errors
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
                    style={{ marginRight: "10px" }}
                >
                    {items.map((item) => (
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
