import {DollarCircleOutlined} from "@ant-design/icons";
import {Input, Select} from "antd";
import {appVersionTags, appVersionTypes} from "../storeConstants";
import UserInputLabel from "../../../../components/UserInputs/UserInputLabel";
import {useEffect} from "react";

const apiFields = {
    versionType: "version_type",
    versionTag: "version_tag",
    price: "price"
}

export default function UploadApp({setUploadInfo, uploadInfo, app}) {
    const versionTypeOptions = Object.keys(appVersionTypes).map(versionType => {
        return {label: appVersionTypes[versionType].title, value: appVersionTypes[versionType].key}
    })
    const versionTagOptions = Object.keys(appVersionTags).map(versionTag => {
        return {label: appVersionTags[versionTag].title, value: appVersionTags[versionTag].key}
    })
    function handleInputChange(key, value) {
        setUploadInfo(prevInfo => ({
            ...prevInfo,
            [key]: value
        }))
    }
    useEffect(() => {
        setUploadInfo({
            [apiFields.price]: 0,
            [apiFields.versionType]: versionTypeOptions[0].value,
            [apiFields.versionTag]: versionTagOptions[0].value,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (<div style={
        {marginRight: "20px"}
    }>
        <UserInputLabel children
            title={
                `Select the realease type for your ${
                    app.categories[0]
                }`
        }>
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
            title={
                `Define a monthly price for your ${
                    app.categories[0]
                }`
        }>
            <Input onChange={
                    (event) => handleInputChange(apiFields.price, event?.target?.value)
                }
                value={
                    uploadInfo?.price || app.price
                }
                addonAfter={<DollarCircleOutlined/>}
                defaultValue="5"/>
        </UserInputLabel>
    </div>)
}
