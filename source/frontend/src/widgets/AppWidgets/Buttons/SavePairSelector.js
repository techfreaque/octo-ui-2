import {useMemo} from "react"
import AntButton, {buttonTypes, buttonVariants} from "../../../components/Buttons/AntButton"
import {SaveOutlined} from "@ant-design/icons"
import {Trans} from "react-i18next"
import {useCurrentCurrencyListContext, useExchangeConfigUpdateContext, useHandleProfileUpdate, usePairSelectorMenuOpenContext, useUnsavedCurrencyListContext, useUpdatePairSelectorMenuOpenContext} from "../../../context/data/BotExchangeInfoProvider"

export default function SavePairSelector() {
    const setPairSelectorMenuOpen = useUpdatePairSelectorMenuOpenContext()
    const pairSelectorMenuOpen = usePairSelectorMenuOpenContext()
    const currentCurrencyList = useCurrentCurrencyListContext()
    const unsavedCurrencyList = useUnsavedCurrencyListContext()
    const handleProfileUpdate = useHandleProfileUpdate()
    const exchangeConfigUpdate = useExchangeConfigUpdateContext()
    
    return useMemo(() => {
        const exchangeConfigUpdateHasChanged = Boolean(exchangeConfigUpdate.global_config && Object.keys(exchangeConfigUpdate.global_config).length)
        const hasUnsavedChanges = JSON.stringify(unsavedCurrencyList) !== JSON.stringify(currentCurrencyList)
        function handleSave(restartAfterSave = true) {
            handleProfileUpdate(restartAfterSave)
            setPairSelectorMenuOpen({open: false, wantsClose: false})
        }
        if (pairSelectorMenuOpen?.open) {
            return(exchangeConfigUpdateHasChanged || hasUnsavedChanges) && (<span style={
                {
                    margin: "auto",
                    display: "flex",
                    marginRight: "5px"
                }
            }>
                <AntButton onClick={
                        () => handleSave(true)
                    }
                    antIconComponent={SaveOutlined}
                    buttonType={
                        buttonTypes.error
                    }
                    buttonVariant={
                        buttonVariants.primary
                }>
                    <Trans i18nKey="pairSelector.SaveAndRestart"/>
                </AntButton>
            </span>)
        } else 
            (<></>)
        
    }, [currentCurrencyList, exchangeConfigUpdate.global_config, handleProfileUpdate, pairSelectorMenuOpen?.open, setPairSelectorMenuOpen, unsavedCurrencyList])
}
