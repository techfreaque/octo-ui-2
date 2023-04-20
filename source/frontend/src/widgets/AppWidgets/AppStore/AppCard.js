import React from "react";
import {styled} from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {red} from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useInstallAppPackage, useInstallProfile} from "../../../context/data/AppStoreDataProvider";
import {TextField} from "@mui/material";

const ExpandMore = styled((props) => {
    const {
        expand,
        ...other
    } = props;
    return (
        <IconButton {...other}/>
    );
})(({theme, expand}) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {duration: theme.transitions.duration.shortest})
}));

export default function AppCard({app}) {
    const [expanded, setExpanded] = React.useState(false);
    const [token, setToken] = React.useState();
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    function handleSetToken(event) {
        setToken(event.target.value);
    }
    return (
        <Card sx={
            {margin: 1}
        }>
            <CardHeader avatar={
                    (
                        <Avatar sx={
                                {bgcolor: red[500]}
                            }
                            aria-label="recipe">
                            {
                            app.title[0]
                        } </Avatar>
                    )
                }
                action={
                    (!app.requires_auth || token) && (
                        <InstallAppMenu app={app}
                            token={token}/>
                    )
                }
                title={
                    app.title
                }
                // subheader="September 14, 2016"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {
                    app.description
                } </Typography>
                {
                app.requires_auth && (
                    <>
                        <Typography variant="body2" color="text.secondary"
                            style={
                                {marginTop: "10px"}
                        }>
                            This app requires a license key to download
                        </Typography>
                        <TextField id="token" label="Enter your license key"
                            value={token}
                            onChange={handleSetToken}
                            style={
                                {marginTop: "10px"}
                            }/>
                    </>
                )
            } </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon/>
                </IconButton>
                <ExpandMore expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more">
                    <ExpandMoreIcon/>
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded}
                timeout="auto"
                unmountOnExit>
                <CardContent>
                    <Typography paragraph>Nothing here yet</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

function InstallAppMenu({app, token}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const installAppPackage = useInstallAppPackage()
    const installProfile = useInstallProfile()
    return (
        <div>
            <IconButton id="basic-button"
                aria-controls={
                    open ? 'basic-menu' : undefined
                }
                aria-haspopup="true"
                aria-expanded={
                    open ? 'true' : undefined
                }
                onClick={handleClick}
                aria-label="Donwload Package">
                <FontAwesomeIcon icon={faDownload}/>
            </IconButton>
            <Menu id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={
                    {'aria-labelledby': 'basic-button'}
            }>
                {
                app.versions.map((appVersion) => (
                    <MenuItem key={
                            appVersion.version
                        }
                        onClick={
                            () => {
                                app?.categories?.includes("Profiles") ? installProfile(appVersion.url, app.title, app.name) : installAppPackage(appVersion.url, app.title + " " + appVersion.version, token)
                            }
                    }>
                        {
                        appVersion.version
                    }
                        <FontAwesomeIcon icon={faDownload}
                            style={
                                {marginLeft: "5px"}
                            }/>
                    </MenuItem>
                ))
            } </Menu>
        </div>
    );
}
