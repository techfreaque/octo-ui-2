import {useEffect} from "react"

export default function AppDownloadForm({setDownloadInfo, downloadInfo, app}) {
    useEffect(() => {
        setDownloadInfo({should_select_profile: false, major_version: app.versions[0].major_version, minor_version: app.versions[0].minor_version, bug_fix_version: app.versions[0].bug_fix_version})
    }, [])
    return (<div style={
        {marginRight: "20px"}
    }> {
        app?.versions?.map((version, index) => (<Version key={index} version={version}
            setDownloadInfo={setDownloadInfo}
            downloadInfo={downloadInfo}/>))
    } </div>)
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
