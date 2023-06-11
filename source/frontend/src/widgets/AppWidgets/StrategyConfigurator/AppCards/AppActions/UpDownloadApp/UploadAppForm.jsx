import {DollarCircleOutlined} from "@ant-design/icons";
import {
    Alert,
    Input,
    Select,
    Switch,
    Tooltip
} from "antd";
import {appVersionTags, appVersionTypes, strategyName} from "../../../storeConstants";
import UserInputLabel from "../../../../../../components/UserInputs/UserInputLabel";
import {useEffect} from "react";
const {TextArea} = Input;

export const apiFields = {
    versionType: "version_type",
    versionTag: "version_tag",
    price: "price",
    releaseNotes: "release_notes"
}

export const minReleaseNotesLength = 50

export default function UploadAppForm({setUploadInfo, uploadInfo, app}) {
    const versionTypeOptions = Object.keys(appVersionTypes).map(versionType => {
        return {label: appVersionTypes[versionType].title, value: appVersionTypes[versionType].key}
    })
    const versionTagOptions = Object.keys(appVersionTags).map(versionTag => {
        return {label: appVersionTags[versionTag].title, value: appVersionTags[versionTag].key}
    })
    const isStrategy = app.categories?.[0] === strategyName
    function handleInputChange(key, value) {
        setUploadInfo(prevInfo => ({
            ...prevInfo,
            [key]: value
        }))
    }
    useEffect(() => {
        setUploadInfo(prevInfo => {
            return {
                ...prevInfo,
                includePackage: isStrategy ? true : prevInfo.includePackage,
                [apiFields.price]: prevInfo[apiFields.price] || app.price || 0,
                [apiFields.versionType]: prevInfo[apiFields.versionType] || versionTypeOptions[0].value,
                [apiFields.versionTag]: prevInfo[apiFields.versionTag] || versionTagOptions[0].value
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app])

    return (<div style={
        {marginRight: "20px"}
    }> {
        ! isStrategy && (<UserInputLabel children
            title={"Upload new package version"}>
            <Switch checked={
                    uploadInfo?.includePackage
                }
                onChange={
                    (checked) => handleInputChange("includePackage", checked)
                }/>
        </UserInputLabel>)
    }
        {
        uploadInfo?.includePackage && <UploadPackage versionTypeOptions={versionTypeOptions}
            app={app}
            versionTagOptions={versionTagOptions}
            uploadInfo={uploadInfo}
            handleInputChange={handleInputChange}/>
    } </div>)
}


function UploadPackage({
    versionTypeOptions,
    app,
    versionTagOptions,
    uploadInfo,
    handleInputChange
}) {
    return (<> {
        app.is_from_store && <UserInputLabel children
            title={`Select the type of your update`}>
            <Select defaultValue={
                    versionTypeOptions[0].value
                }
                onChange={
                    (value) => handleInputChange(apiFields.versionType, value)
                }
                style={
                    {width: "100%"}
                }
                options={versionTypeOptions}/>
        </UserInputLabel>
    }
        <UserInputLabel children
            title={
                `How stable is your ${
                    app.categories[0]
                }`
        }>
            <Select defaultValue={
                    versionTagOptions[0].value
                }
                onChange={
                    (value) => handleInputChange(apiFields.versionTag, value)
                }
                style={
                    {width: "100%"}
                }
                options={versionTagOptions}/>
        </UserInputLabel>
        <UserInputLabel children
            title={'Share release notes'}> {
            (uploadInfo?.[apiFields.releaseNotes]?.length||0) < minReleaseNotesLength && (
                                                                                                            <Alert message={(<>
                                                                                                                    <div>Let your users know what you've changed. 
                                                                                                                        </div>
                                                                                                                        <div>
                                                                                                                            {`Add at least ${minReleaseNotesLength - (uploadInfo?.[apiFields.releaseNotes]?.length || 0)} more characters`}
                                                                                                                        </div>
                                                                                                                        
                                                                                                                    </>)
                                                                                                                }
                                                                                                                    type="info"
                                                                                                                    style={{marginBottom: "5px"}}
                                                                                                                />
                                                                                                        )
                                                                                                    }
                                                                                                        <TextArea onChange={
                                                                                                                (event) => handleInputChange(apiFields.releaseNotes, event?.target?.value)
                                                                                                            }
                                                                                                            autoSize={
                                                                                                                {
                                                                                                                    minRows: 2,
                                                                                                                    maxRows: 6
                                                                                                                }
                                                                                                            }/>
                                                                                                        <div style={
                                                                                                            {margin: '24px 0'}
                                                                                                        }/>
                                                                                </UserInputLabel>
                                                                                <UserInputLabel children
                                                                                        title={
                                                                                            `Define a monthly price for your ${
                                                                                                app.categories[0]
                                                                                            }`
                                                                                    }>
                                                                                        <Tooltip title={"Define a price for your app"}>
                                                                                            <div>
                                                                                                <Input onChange={
                                                                                                        (event) => handleInputChange(apiFields.price, event?.target?.value)
                                                                                                    }
                                                                                                    value={
                                                                                                        uploadInfo?.price || app.price
                                                                                                    }
                                                                                                    addonAfter={<DollarCircleOutlined/>}
                                                                                                    defaultValue="0"/>
                                                                                            </div>
                                                                                        </Tooltip>
                                                                                    </UserInputLabel>
                                                                                                        </>)
        }
