import { CheckCircleFilled, ExclamationCircleFilled, SyncOutlined } from "@ant-design/icons"
import { Badge, Typography, Card  } from "antd"
import {useEffect} from "react"
import RadioButtonGroup from "../../../../../../components/Buttons/RadioButtonGroup"


export default function AppDownloadForm({setDownloadInfo, downloadInfo, app}) {
    // useEffect(() => {
    //     setDownloadInfo({should_select_profile: false, major_version: app.versions[0].major_version, minor_version: app.versions[0].minor_version, bug_fix_version: app.versions[0].bug_fix_version})
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])
    
    return (<div style={
        {marginRight: "20px"}
    }> 
    <UpdateAvailable />
    <UpToDate app={app}/>
    <AppVersion />
    {/* {
        app?.versions?.map((version, index) => (<Version key={index} version={version}
            setDownloadInfo={setDownloadInfo}
            downloadInfo={downloadInfo}/>))
    }  */}
    </div>)
}

function Version({version, setDownloadInfo, downloadInfo}) {
    const isSelected = ((version.major_version === downloadInfo.major_version) && (version.minor_version === downloadInfo.minor_version) && (version.bug_fix_version === downloadInfo.bug_fix_version))
    function handdleVersionSelect() {
        setDownloadInfo({should_select_profile: false, major_version: version.major_version, minor_version: version.minor_version, bug_fix_version: version.bug_fix_version})
    };
    const title = `${
        `${
            version.major_version
        }.${
            version.minor_version
        }.${
            version.bug_fix_version
        }`
    } ${
        version.version_tag
    }`
    return (<div style={
            isSelected ? {
                backgroundColor: "blue"
            } : {}
        }
        onClick={handdleVersionSelect}> {title} </div>)
}

function UpdateAvailable() {
    const {Title} = Typography;
    return (
    <div style={{display:'flex', alignItems:'center'}} >
        <Badge
            count={
                <ExclamationCircleFilled 
                style={{
                color: '#faad14',
                fontSize: '14px'
                }} />}
            offset={[-3, 20]}
        >
        <SyncOutlined 
        style={{fontSize:'24px'}}/>
        </Badge>
        <Title level={3} style={{marginLeft:'10px', marginBottom:'0px'}}> 
        Update available</Title>
        </div>
    )
}

function UpToDate(app) {
    const {Title} = Typography;
    const category = app?.categories?.length > 1 ? 'Package' : app?.categories?.[0]
    return (
    <div style={{display:'flex', alignItems:'center'}} >
        <Badge
            count={
            <CheckCircleFilled 
                style={{
                color: '#5aef70',
                fontSize: '14px'
                }} />}
            offset={[-3, 20]}
        >
        <SyncOutlined 
        style={{fontSize:'24px'}}/>
        </Badge>
        <Title level={3} style={{marginLeft:'10px', marginBottom:'0px'}}> 
        Your {category} is up to date</Title>
        </div>
    )
}

function AppVersion() {
    const {Title, Text} = Typography;
    const _versionTypes = [
        {
            label: (
                <Title level={4}> α </Title>
            ),

            toolTipText: (
                'Switch to the alpha version'
            ),
            key: 'alpha',
            // disabled: true
        },
        {
            label: (
                <Title level={4}> β </Title>
            ),

            toolTipText: (
                'Switch to the beta version'
            ),
            key: 'beta',
            // disabled: true
        },
        {
            label: (
                <Title level={4}> S </Title>
            ),

            toolTipText: (
                'Switch to the stable version'
            ),
            key: 'stable',
            // disabled: true
        },]
    return(
        <div style={{marginTop:'20px'}}>
        <Title level={4}>Select version </Title>
        <RadioButtonGroup menuItems={_versionTypes}
            onChange={undefined}
            selected={'stable'}/>
        <div style={{marginTop:'20px', marginBottom:'10px'}}>
            <Title level={4}>Version details</Title>
            <Text>v1.2 fix some bug and ..</Text>
        </div>
        </div>
    )
}

