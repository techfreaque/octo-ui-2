import {CheckCircleFilled, ExclamationCircleFilled, SyncOutlined} from "@ant-design/icons"
import {Badge, Typography} from "antd"
import {useState} from "react"

import AppIconButton from "../../../../../../components/Buttons/AppIconButton"
import {useBotColorsContext} from "../../../../../../context/config/BotColorsProvider"


export default function AppDownloadForm({setDownloadInfo, downloadInfo, app}) {
    // useEffect(() => {
    //     setDownloadInfo({should_select_profile: false, major_version: app.versions[0].major_version, minor_version: app.versions[0].minor_version, bug_fix_version: app.versions[0].bug_fix_version})
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    return (<div style={
        {marginRight: "20px"}
    }>
        <UpdateAvailable/>
        <UpToDate app={app}/>
        <AppVersions app={app}
            setDownloadInfo={setDownloadInfo}
            downloadInfo={downloadInfo}/>

    </div>)
}


function UpdateAvailable() {
    const {Title} = Typography;
    return (<div style={
        {
            display: 'flex',
            alignItems: 'center'
        }
    }>
        <Badge count={
                (<ExclamationCircleFilled style={
                    {
                        color: '#faad14',
                        fontSize: '14px'
                    }
                }/>)
            }
            offset={
                [-3, 20]
        }>
            <SyncOutlined style={
                {fontSize: '24px'}
            }/>
        </Badge>
        <Title level={3}
            style={
                {
                    marginLeft: '10px',
                    marginBottom: '0px'
                }
        }>
            Update available</Title>
    </div>)
}

function UpToDate(app) {
    const {Title} = Typography;
    const category = app?.categories?.length > 1 ? 'Package' : app?.categories?.[0]
    return (<div style={
        {
            display: 'flex',
            alignItems: 'center'
        }
    }>
        <Badge count={
                (<CheckCircleFilled style={
                    {
                        color: '#5aef70',
                        fontSize: '14px'
                    }
                }/>)
            }
            offset={
                [-3, 20]
        }>
            <SyncOutlined style={
                {fontSize: '24px'}
            }/>
        </Badge>
        <Title level={3}
            style={
                {
                    marginLeft: '10px',
                    marginBottom: '0px'
                }
        }>
            Your {category}
            is up to date</Title>
    </div>)
}

function AppVersions({app, setDownloadInfo, downloadInfo}) {
    const [versionType, setVersionType] = useState("stable_version")
    const botColors = useBotColorsContext()
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

    const selectedVersion = app?.versions?.filter(version => (downloadInfo?.major_version === version.major_version && downloadInfo?.minor_version === version.minor_version && downloadInfo?.bug_fix_version === version.bug_fix_version))?.[0]
    return (<div style={
        {marginTop: '20px'}
    }>
        <Typography.Title level={4}>Select a version type</Typography.Title>
        <div style={
            {display: "flex"}
        }> {
            versionTypes.map(versionTypeObj => (<AppIconButton key={
                    versionTypeObj.key
                }
                isSelected={false}
                active={
                    versionType === versionTypeObj.key
                }
                buttonTitle={
                    versionTypeObj.label
                }
                disabled={false}
                icon={
                    versionTypeObj.icon
                }
                onClick={
                    () => setVersionType(versionTypeObj.key)
                }/>))
        } </div>
        <div> {
            app?.versions?.filter(version => (version.version_tag === versionType)).map((version, index) => (<Version key={index}
                version={version}
                botColors={botColors}
                setDownloadInfo={setDownloadInfo}
                downloadInfo={downloadInfo}/>))
        } </div>
        <div style={
            {
                marginTop: '20px',
                marginBottom: '10px'
            }
        }> {
            selectedVersion && (<>
                <Typography.Title level={4}>Selected Version Details</Typography.Title>
                <Typography.Text>v{
                    `${
                        selectedVersion.major_version
                    }.${
                        selectedVersion.minor_version
                    }.${
                        selectedVersion.bug_fix_version
                    } ${
                        selectedVersion.version_tag
                    } - ${selectedVersion}`
                }
                    - fix some bug and ..</Typography.Text>
            </>)
        } </div>
    </div>)
}

function Version({version, setDownloadInfo, downloadInfo, botColors}) {
    const isSelected = ((version.major_version === downloadInfo?.major_version) && (version.minor_version === downloadInfo?.minor_version) && (version.bug_fix_version === downloadInfo?.bug_fix_version))
    function handdleVersionSelect() {
        setDownloadInfo({should_select_profile: false, major_version: version.major_version, minor_version: version.minor_version, bug_fix_version: version.bug_fix_version})
    };
    const title = `${

        version.major_version
    }.${
        version.minor_version
    }.${
        version.bug_fix_version
    } ${
        version.version_tag
    }`
    return (<div style={
            isSelected ? {
                color: botColors?.fontActive
            } : {}
        }
        onClick={handdleVersionSelect}> {title} </div>)
}
