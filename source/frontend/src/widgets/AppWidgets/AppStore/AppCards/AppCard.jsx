import {useState} from 'react';
import TradingModeCard from './TradingModeCard';
import StrategyCard from './StrategyCard';
import {Grid} from '@mui/material';
import OtherAppCard from './OtherAppCard';


const tradingModeCategoryName = "Strategy Mode"
const profileCategoryName = "Strategy"

export default function AppCard({
    app,
    apps,
    isLoading,
    setIsloading,
    setSelectedCategories,
    currentStrategy
}) {
    const [isMouseHover, setMouseHover] = useState(false);
    const category = app?.categories?.length > 1 ? 'Package' : app?.categories?.[0]
    if (category === tradingModeCategoryName) {
        return (<SelectedCardContainer app={app}>
            <TradingModeCard app={app}
                apps={apps}
                currentStrategy={currentStrategy}
                setMouseHover={setMouseHover}
                category={category}
                setSelectedCategories={setSelectedCategories}
                isLoading={isLoading}
                setIsloading={setIsloading}
                isMouseHover={isMouseHover}/>
        </SelectedCardContainer>)
    } else if (category === profileCategoryName) {
        return (<SelectedCardContainer app={app}>
            <StrategyCard app={app}
                isLoading={isLoading}
                setIsloading={setIsloading}
                setMouseHover={setMouseHover}
                category={category}
                setSelectedCategories={setSelectedCategories}
                isMouseHover={isMouseHover}
                // isMouseHover={true}
            />
        </SelectedCardContainer>)
    } else {
        return (<SelectedCardContainer app={app}>
            <OtherAppCard app={app}
                isLoading={isLoading}
                setIsloading={setIsloading}
                setMouseHover={setMouseHover}
                category={category}
                setSelectedCategories={setSelectedCategories}
                isMouseHover={isMouseHover}
                // isMouseHover={true}
            />
        </SelectedCardContainer>)
    }
};


function SelectedCardContainer({app, children}) {
    return app?.is_selected ? (<Grid item
    xs={12}> {children}</Grid>) : (<Grid style={
        {
            margin: "auto",
            height: "100%",
            // maxWidth: "500px"
        }
    }
    item
    xs={12}
    sm={12}
    md={12}
    lg={6}
    xl={4}
    xxl={4}> {children}</Grid>);
}


// const ExpandMore = styled((props) => {
//     const {
//         expand,
//         ...other
//     } = props;
//     return (
//         <IconButton {...other}/>
//     );
// })(({theme, expand}) => ({
//     transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
//     marginLeft: "auto",
//     transition: theme.transitions.create("transform", {duration: theme.transitions.duration.shortest})
// }));

// export default function AppCard({app}) {
//     const [expanded, setExpanded] = React.useState(false);
//     const [token, setToken] = React.useState();
//     const handleExpandClick = () => {
//         setExpanded(!expanded);
//     };
//     function handleSetToken(event) {
//         setToken(event.target.value);
//     }
//     return (
//         <Card sx={
//             {margin: 1}
//         }>
//             <CardHeader avatar={
//                     (
//                         <Avatar sx={
//                                 {bgcolor: red[500]}
//                             }
//                             aria-label="recipe">
//                             {
//                             app.title[0]
//                         } </Avatar>
//                     )
//                 }
//                 action={
//                     (!app.requires_auth || token) && (
//                         <InstallAppMenu app={app}
//                             token={token}/>
//                     )
//                 }
//                 title={
//                     app.title
//                 }
//                 // subheader="September 14, 2016"
//             />
//             <CardContent>
//                 <Typography variant="body2" color="text.secondary">
//                     {
//                     app.description
//                 } </Typography>
//                 {
//                 app.requires_auth && (
//                     <>
//                         <Typography variant="body2" color="text.secondary"
//                             style={
//                                 {marginTop: "10px"}
//                         }>
//                             This app requires a license key to download
//                         </Typography>
//                         <TextField id="token" label="Enter your license key"
//                             value={token}
//                             onChange={handleSetToken}
//                             style={
//                                 {marginTop: "10px"}
//                             }/>
//                     </>
//                 )
//             } </CardContent>
//             <CardActions disableSpacing>
//                 <IconButton aria-label="add to favorites">
//                     <FavoriteIcon/>
//                 </IconButton>
//                 <IconButton aria-label="share">
//                     <ShareIcon/>
//                 </IconButton>
//                 <ExpandMore expand={expanded}
//                     onClick={handleExpandClick}
//                     aria-expanded={expanded}
//                     aria-label="show more">
//                     <ExpandMoreIcon/>
//                 </ExpandMore>
//             </CardActions>
//             <Collapse in={expanded}
//                 timeout="auto"
//                 unmountOnExit>
//                 <CardContent>
//                     <Typography paragraph>Nothing here yet</Typography>
//                 </CardContent>
//             </Collapse>
//         </Card>
//     );
// }

// function InstallAppMenu({app, token}) {
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const open = Boolean(anchorEl);
//     const handleClick = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//     const handleClose = () => {
//         setAnchorEl(null);
//     };
//     const installAppPackage = useInstallAppPackage()
//     const installProfile = useInstallProfile()
//     return (
//         <div>
//             <IconButton id="basic-button"
//                 aria-controls={
//                     open ? 'basic-menu' : undefined
//                 }
//                 aria-haspopup="true"
//                 aria-expanded={
//                     open ? 'true' : undefined
//                 }
//                 onClick={handleClick}
//                 aria-label="Donwload Package">
//                 <FontAwesomeIcon icon={faDownload}/>
//             </IconButton>
//             <Menu id="basic-menu"
//                 anchorEl={anchorEl}
//                 open={open}
//                 onClose={handleClose}
//                 MenuListProps={
//                     {'aria-labelledby': 'basic-button'}
//             }>
//                 {
//                 app.versions.map((appVersion) => (
//                     <MenuItem key={
//                             appVersion.version
//                         }
//                         onClick={
//                             () => {
//                                 app?.categories?.includes("Strategy") ? installProfile(appVersion.url, app.title, app.name) : installAppPackage(appVersion.url, app.title + " " + appVersion.version, token)
//                             }
//                     }>
//                         {
//                         appVersion.version
//                     }
//                         <FontAwesomeIcon icon={faDownload}
//                             style={
//                                 {marginLeft: "5px"}
//                             }/>
//                     </MenuItem>
//                 ))
//             } </Menu>
//         </div>
//     );
// }
