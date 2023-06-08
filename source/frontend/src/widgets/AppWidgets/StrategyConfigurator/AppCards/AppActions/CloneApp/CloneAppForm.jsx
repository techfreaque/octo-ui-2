import {useEffect} from "react"
import UserInputLabel from "../../../../../../components/UserInputs/UserInputLabel"
import { Input, Switch } from "antd"

export default function CloneAppForm({setCloneAppInfo, cloneAppInfo, app}) {
    useEffect(() => {
        setCloneAppInfo({newProfileName: app.title + " Copy",
            selectNewProfile: true})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    function handleInputChange(key, value) {
        setCloneAppInfo(prevInfo => ({
            ...prevInfo,
            [key]: value
        }))
    }
    return (<div style={
        {marginRight: "20px"}
    }>
     <UserInputLabel children
            title={
                `Define a new title for your strategy`
        }>
            <Input onChange={
                    (event) => handleInputChange("newProfileName", event?.target?.value)
                }
                value={
                    cloneAppInfo?.newProfileName
                }
              />
        </UserInputLabel>
     <UserInputLabel children
            title={
                `Do you want to select the new strategy?`
        }>
            <Switch onChange={
                    (value) => handleInputChange("selectNewProfile", value)
                }
                checked={
                    cloneAppInfo?.selectNewProfile
                }
              />
        </UserInputLabel>
    </div>)
}
