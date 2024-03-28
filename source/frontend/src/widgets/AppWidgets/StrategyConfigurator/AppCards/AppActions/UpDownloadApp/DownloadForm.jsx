import {DownloadOutlined, ShoppingCartOutlined} from "@ant-design/icons"
import {
    Alert,
    Card,
    Tooltip,
    Typography
} from "antd"
import {useEffect, useState} from "react"

import AppIconButton from "../../../../../../components/Buttons/AppIconButton"
import {useBotColorsContext} from "../../../../../../context/config/BotColorsProvider"
import AntTable from "../../../../../../components/Tables/AntTable"
import {useAddToAppStoreCart, useAppStoreDataContext, useIsInAppStoreCart, useUpdateAppStoreCartIsOpenContext} from "../../../../../../context/data/AppStoreDataProvider"
import {IsInstalledIcon, IsNotInstalledIcon} from "../../AppCover"
import AntButton from "../../../../../../components/Buttons/AntButton"
import {Grid} from "@mui/material"
import {appPackagesName, strategyName} from "../../../storeConstants"


export default function AppDownloadForm({setDownloadInfo, downloadInfo, app, handleDownload}) {
    return (
        <div style={
            {marginRight: "20px"}
        }>
            {/* <UpdateAvailable/>
            <UpToDate app={app}/> */}
            <AppVersions app={app}
                handleDownload={handleDownload}
                setDownloadInfo={setDownloadInfo}
                downloadInfo={downloadInfo}/>

        </div>
    )
}


// function UpdateAvailable() {
//     const {Title} = Typography;
//     return (
//         <div style={
//             {
//                 display: 'flex',
//                 alignItems: 'center'
//             }
//         }>
//             <Badge count={
//                     (
//                         <ExclamationCircleFilled style={
//                             {
//                                 color: '#faad14',
//                                 fontSize: '14px'
//                             }
//                         }/>
//                     )
//                 }
//                 offset={
//                     [-3, 20]
//             }>
//                 <SyncOutlined style={
//                     {fontSize: '24px'}
//                 }/>
//             </Badge>
//             <Title level={3}
//                 style={
//                     {
//                         marginLeft: '10px',
//                         marginBottom: '0px'
//                     }
//             }>
//                 Update available</Title>
//         </div>
//     )
// }

// function UpToDate(app) {
//     const {Title} = Typography;
//     const category = app?.categories?.length > 1 ? 'Package' : app?.categories?.[0]
//     return (
//         <div style={
//             {
//                 display: 'flex',
//                 alignItems: 'center'
//             }
//         }>
//             <Badge count={
//                     (
//                         <CheckCircleFilled style={
//                             {
//                                 color: '#5aef70',
//                                 fontSize: '14px'
//                             }
//                         }/>
//                     )
//                 }
//                 offset={
//                     [-3, 20]
//             }>
//                 <SyncOutlined style={
//                     {fontSize: '24px'}
//                 }/>
//             </Badge>
//             <Title level={3}
//                 style={
//                     {
//                         marginLeft: '10px',
//                         marginBottom: '0px'
//                     }
//             }>
//                 Your {category}
//                 is up to date</Title>
//         </div>
//     )
// }

const versionTypes = [
    {
        label: "Alpha Versions",
        icon: "α",

        toolTipText: ('Switch to the alpha version'),
        key: 'alpha_version',
        // disabled: true
    }, {
        label: "Beta Versions",
        icon: "β",


        toolTipText: ('Switch to the beta version'),
        key: 'beta_version',
        // disabled: true
    }, {
        label: "Stable Versions",
        icon: "S",


        toolTipText: ('Switch to the stable version'),
        key: 'stable_version',
        // disabled: true
    },
]
function AppVersions({app, setDownloadInfo, downloadInfo, handleDownload}) { // const [versionType, setVersionType] = useState("stable_version")
    const botColors = useBotColorsContext()


    const reversedVersions = app.versions?.reverse()
    const preSorteddata = reversedVersions?.filter(version => (downloadInfo?.visibleVersionTypes?.includes(version.version_tag))).map(version => {

        const title = `${

            version.major_version
        }.${
            version.minor_version
        }.${
            version.bug_fix_version
        } ${
            versionTagKeyToTitle[version.version_tag]
        } - ${
            app.title
        }`
        const isSelected = ((version.major_version === downloadInfo?.major_version) && (version.minor_version === downloadInfo?.minor_version) && (version.bug_fix_version === downloadInfo?.bug_fix_version))
        return {
            key: title,
            major_version: version.major_version,
            minor_version: version.minor_version,
            bug_fix_version: version.bug_fix_version,
            title: (
                <div onClick={
                        () => handdleVersionSelect(setDownloadInfo, version, handleAccordionChange)
                    }
                    style={
                        isSelected ? {
                            color: botColors?.fontActive
                        } : {}
                }>
                    {title} </div>
            )
        }
    })
    useEffect(() => {
        setDownloadInfo(prevDownloadInfo => ({
            ...prevDownloadInfo,
            visibleVersionTypes: [
                "stable_version", 'alpha_version', 'beta_version'
            ],
            major_version: reversedVersions?.[0]?.major_version,
            minor_version: reversedVersions?.[0]?.minor_version,
            bug_fix_version: reversedVersions?.[0]?.bug_fix_version,
            versionDetailsOpen: reversedVersions?.length ? true : false
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reversedVersions])

    function handleVersionFilterChange(versionTypeKey) {
        setDownloadInfo(prevDownloadInfo => ({
            ...prevDownloadInfo,
            visibleVersionTypes: downloadInfo?.visibleVersionTypes?.includes(versionTypeKey) ? downloadInfo.visibleVersionTypes.filter(thissVersionKey => (thissVersionKey !== versionTypeKey)) : [
                ...(downloadInfo?.visibleVersionTypes || []),
                versionTypeKey
            ]
        }))
    }
    function handleAccordionChange(detailsOpen) {
        setDownloadInfo(prevDownloadInfo => ({
            ...prevDownloadInfo,
            versionDetailsOpen: detailsOpen
        }))
    }
    const selectedVersion = app?.versions?.filter(version => (downloadInfo?.major_version === version.major_version && downloadInfo?.minor_version === version.minor_version && downloadInfo?.bug_fix_version === version.bug_fix_version))?.[0]


    return (
        <>
            <VersionSelector app={app}
                handleAccordionChange={handleAccordionChange}
                handleVersionFilterChange={handleVersionFilterChange}
                downloadInfo={downloadInfo}
                preSorteddata={preSorteddata}/>
            <div style={
                {
                    marginTop: '20px',
                    marginBottom: '10px',
                    // width: "350px"

                }
            }>
                {
                (selectedVersion && downloadInfo.versionDetailsOpen) && (
                    <>
                        <Typography.Title level={3}>
                            {
                            `v${
                                selectedVersion.major_version
                            }.${
                                selectedVersion.minor_version
                            }.${
                                selectedVersion.bug_fix_version
                            } ${
                                versionTagKeyToTitle[selectedVersion.version_tag]
                            } Details:`
                        }</Typography.Title>
                        <Alert type="info"
                            showIcon={true}
                            message={
                                `${
                                    app.title
                                } is part of these Packages:`
                            }
                            style={
                                {marginBottom: "5px"}
                            }/>

                        <RequiredPackages app={app}
                            selectedVersion={selectedVersion}
                            downloadInfo={downloadInfo}
                            handleDownload={handleDownload}
                            setDownloadInfo={setDownloadInfo}/>


                        <Typography.Title level={5}>
                            {
                            `Release Notes of ${
                                app.title
                            } v${
                                selectedVersion.major_version
                            }.${
                                selectedVersion.minor_version
                            }.${
                                selectedVersion.bug_fix_version
                            } ${
                                versionTagKeyToTitle[selectedVersion.version_tag]
                            }:`
                        } </Typography.Title>
                        <Typography.Text> {
                            selectedVersion.release_notes
                        } </Typography.Text>

                    </>
                )
            } </div>
        </>
    )
}

function RequiredPackages({
    app,
    selectedVersion,
    downloadInfo,
    handleDownload,
    setDownloadInfo
}) {
    const appStoreData = useAppStoreDataContext();
    const requiredAppsByTentaclePackage = {}
    const requiredApps = [
        app.package_id,
        ...(selectedVersion?.requirements ? selectedVersion.requirements : [])
    ]
    let requirementsSatisfied = true
    requiredApps.forEach((requirement, index) => {
        for (const potentialRequiredAppCategory in appStoreData) {
            for (const potentialRequiredAppName in appStoreData[potentialRequiredAppCategory]) {
                const potentialRequiredApp = appStoreData[potentialRequiredAppCategory][potentialRequiredAppName]
                if (potentialRequiredApp.package_id === requirement) {
                    if (! requiredAppsByTentaclePackage[potentialRequiredApp.origin_package]) {
                        requiredAppsByTentaclePackage[potentialRequiredApp.origin_package] = [];
                    }
                    if (potentialRequiredApp.origin_package) {
                        requiredAppsByTentaclePackage[potentialRequiredApp.origin_package].push(potentialRequiredApp)
                    }
                    const packageInstalled = requiredAppsByTentaclePackage[potentialRequiredApp.origin_package].every(thisApp => {
                        return thisApp?.is_installed
                    })
                    requirementsSatisfied = requirementsSatisfied && (index === 0 || packageInstalled)
                }
            }
        }
    })
    return (
        <Grid container
            spacing={2}>

            {
            requiredAppsByTentaclePackage && Object.keys(requiredAppsByTentaclePackage).map((requiredAppPackage, index) => (
                <RequiredPackage key={
                        `${
                            app.package_id
                        }${index}`
                    }
                    app={app}
                    requirementsSatisfied={requirementsSatisfied}
                    isMainPackage={index === 0}
                    requiredAppsByTentaclePackage={requiredAppsByTentaclePackage}
                    requiredAppPackage={requiredAppPackage}
                    downloadInfo={downloadInfo}
                    handleDownload={handleDownload}
                    setDownloadInfo={setDownloadInfo}/>
            ))
        } </Grid>
    )
}

function RequiredPackage({
    app,
    requiredAppsByTentaclePackage,
    requiredAppPackage,
    downloadInfo,
    handleDownload,
    setDownloadInfo,
    requirementsSatisfied,
    isMainPackage
}) {
    const botColors = useBotColorsContext()
    const mainPackageApp = requiredAppsByTentaclePackage[requiredAppPackage][0]
    const packageInstalled = requiredAppsByTentaclePackage[requiredAppPackage].every(thisApp => {
        return thisApp?.is_installed
    })
    const [showAllAppsInpackage, setShowAllAppsInpackage] = useState(false)
    return (
        <Grid item
            xs={12}
            md={6}
            lg={4}

            style={
                {height: "100%"}
        }>
            <Card key={requiredAppPackage}
                style={
                    {
                        marginBottom: "5px",
                        height: "100%"
                    }
            }>
                <Tooltip title={
                    packageInstalled ? "The App package is already installed" : "The App Package isn't installed yet"
                }>
                    <Typography.Title level={5}
                        style={
                            {marginBottom: "5px"}
                    }>
                        {
                        packageInstalled ? (
                            <IsInstalledIcon topRight={false}/>
                        ) : (
                            <IsNotInstalledIcon topRight={false}/>
                        )
                    }
                        <span> {
                            mainPackageApp.categories?.[0] === strategyName ? mainPackageApp.title : requiredAppPackage
                        } </span>
                    </Typography.Title>
                </Tooltip>
                <Typography.Paragraph style={
                    {marginBottom: "5px"}
                }>
                    {
                    ! packageInstalled && (mainPackageApp.price ? `${mainPackageApp.price}$ / month` : "free")
                } </Typography.Paragraph>
                {/* <Alert type="info"
                    showIcon={true}
                    message={
                        `${
                            app.title
                        } uses:`
                    }
                    style={
                        {marginBottom: "5px"}
                    }
                    // description={
                    //     (
 
                    //     )
                    // }
                    
                    /> */}
                Required Apps:
                <ul> {
                    requiredAppsByTentaclePackage[requiredAppPackage].map((requiredApp, index) => (
                        <Tooltip title={
                                requiredApp?.is_installed ? "The App is already installed" : "The App isn't installed yet"
                            }
                            key={
                                `${
                                    requiredApp?.package_id
                                }${index}`
                        }>
                            <div style={
                                {display: "flex"}
                            }>
                                {
                                requiredApp.is_installed ? (
                                    <IsInstalledIcon topRight={false}/>
                                ) : (
                                    <IsNotInstalledIcon topRight={false}/>
                                )
                            }
                                <span style={
                                    {marginLeft: "5px"}
                                }>
                                    {
                                    `${
                                        requiredApp?.title
                                    }`
                                } </span>
                            </div>
                        </Tooltip>
                    ))
                } </ul>

                <div onClick={() => setShowAllAppsInpackage(prevState => (!prevState))} style={{cursor: "pointer", ...(showAllAppsInpackage? { }:{color: botColors?.fontActive})}}>
                All included apps in package:  
                </div>
                {showAllAppsInpackage && (<AllAppsInPackage requiredAppPackage={requiredAppPackage} />)}
                <DownloadPackageButton handleDownload={handleDownload}
                    mainPackageApp={mainPackageApp}
                    packageInstalled={packageInstalled}
                    setDownloadInfo={setDownloadInfo}
                    app={app}
                    requirementsSatisfied={requirementsSatisfied}
                    isMainPackage={isMainPackage}
                    downloadInfo={downloadInfo}/>
            </Card>
        </Grid>
    )
}

function AllAppsInPackage({ requiredAppPackage }) {
    const appStoreData = useAppStoreDataContext();

    return (
        <ul>

        {
                Object.keys(appStoreData).map((category) => {
                
                return category !== appPackagesName&& (
                    <div key={category}>
                    {
                        Object.keys(appStoreData[category]).map((app_id) => {
            if (appStoreData[category][app_id].origin_package === requiredAppPackage) {
                return (
                    <div key={`${category}${app_id}`}>
                        {appStoreData[category][app_id].title}
                    </div>
                        )
            } else {
                return (<span key={`${category}${app_id}`}></span>)
            }
        })    }</div>)
            })}
        </ul>
            )
}

function DownloadPackageButton({
    handleDownload,
    setDownloadInfo,
    downloadInfo,
    mainPackageApp,
    packageInstalled,
    app,
    requirementsSatisfied,
    isMainPackage
}) {
    const addAppStoreCart = useAddToAppStoreCart()
    const checkIsInStoreCart = useIsInAppStoreCart()
    const isOriginPackage = mainPackageApp?.origin_package === app.origin_package
    const mainPackageInCart = checkIsInStoreCart(mainPackageApp)
    const setOpenBasket = useUpdateAppStoreCartIsOpenContext()

    function thisHandleDownload() {
        handleDownload((isDownloading) => setDownloadInfo(prevInfo => ({
            ...prevInfo,
            isDownloading
        })), (! isOriginPackage && mainPackageApp))
    }
    if (isMainPackage && !requirementsSatisfied) {
        return (
            <Tooltip title={"All requirements must be satisfied before you can download this app"}>
                <div>
                    <AntButton block={true}
                        style={
                            {marginTop: "10px"}
                        }
                        disabled={
                            true
                        }
                        antIconComponent={DownloadOutlined}>
                        Download Now
                    </AntButton>
                </div>
            </Tooltip>
        )
    } else  if (packageInstalled && (!mainPackageApp.price || mainPackageApp.has_paid)) {
        return !mainPackageApp.updated_by_distro &&(
            <AntButton block={true}
                style={
                    {marginTop: "10px"}
                }
                disabled={
                    downloadInfo.isDownloading
                }
                onClick={thisHandleDownload}
                antIconComponent={DownloadOutlined}>
                Update Now
            </AntButton>
        )
    } else if (mainPackageApp.price) {
        if (mainPackageApp.has_paid) {
            return (
                <AntButton block={true}
                    style={
                        {marginTop: "10px"}
                    }
                    onClick={thisHandleDownload}
                    antIconComponent={DownloadOutlined}>
                    Download Now
                </AntButton>
            )
        } else if (mainPackageInCart) {
            return (
                <AntButton block={true}
                    style={
                        {marginTop: "10px"}
                    }
                    onClick={
                        () => setOpenBasket(true)
                    }
                    antIconComponent={ShoppingCartOutlined}>
                    Go to Shopping Basket
                </AntButton>
            )
        } else {
            return (
                <AntButton block={true}
                    style={
                        {marginTop: "10px"}
                    }
                    onClick={
                        () => addAppStoreCart(mainPackageApp)
                    }
                    antIconComponent={ShoppingCartOutlined}>
                    Add To Shopping Basket
                </AntButton>
            )
        }
    } else {
        return (
            <AntButton block={true}
                style={
                    {marginTop: "10px"}
                }
                disabled={mainPackageInCart}
                onClick={thisHandleDownload}
                antIconComponent={DownloadOutlined}>
                Download for free
            </AntButton>
        )

    }

}

function VersionSelector({
    app,
    handleAccordionChange,
    handleVersionFilterChange,
    downloadInfo,
    preSorteddata
}) {
    return (
        <div style={
            {marginTop: '20px'}
        }>
            <Typography.Title level={3}
                onClick={
                    () => handleAccordionChange(false)
            }>
                {
                downloadInfo.versionDetailsOpen ? `See all versions of ${
                    app.title
                }` : `Versions of ${
                    app.title
                }`
            }</Typography.Title>
            <div style={
                (downloadInfo.versionDetailsOpen ? {
                    display: "none"
                } : {
                    display: "flex"
                })
            }>
                {
                versionTypes.map(versionTypeObj => (
                    <AppIconButton key={
                            versionTypeObj.key
                        }
                        isSelected={false}
                        active={
                            downloadInfo?.visibleVersionTypes?.includes(versionTypeObj.key)
                        }
                        buttonTitle={
                            versionTypeObj.label
                        }
                        disabled={false}
                        icon={
                            versionTypeObj.icon
                        }
                        onClick={
                            () => handleVersionFilterChange(versionTypeObj.key)
                        }/>
                ))
            } </div>
            <div style={
                {
                    maxHeight: "250px",
                    overflowY: "auto",
                    ...(
                        (downloadInfo.versionDetailsOpen ? {
                            display: "none"
                        } : {})
                    )
                }
            }>
                <AntTable maxWidth="100%"
                    columns={versionColumns}
                    data={preSorteddata}/>
            </div>
        </div>
    )
}


const versionTagKeyToTitle = {
    alpha_version: "Alpha Version",
    beta_version: "Beta Version",
    stable_version: "Stable Version"
}

// const defaultTentaclePackages = {
//     "OctoBot-Default-Tentacles": {},
//     "Matrix-Basic-Tentacles": {}

// }

const versionColumns = [{
        title: 'Select a version',
        dataIndex: 'title',
        key: 'title'
    }];

function handdleVersionSelect(setDownloadInfo, version, handleAccordionChange) {
    handleAccordionChange(true)

    setDownloadInfo(prevDownloadInfo => ({
        ...prevDownloadInfo,
        should_select_profile: false,
        major_version: version.major_version,
        minor_version: version.minor_version,
        bug_fix_version: version.bug_fix_version
    }))
};
