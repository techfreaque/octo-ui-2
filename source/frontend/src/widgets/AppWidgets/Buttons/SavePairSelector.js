import {useMemo} from "react"
import AntButton, {buttonTypes, buttonVariants} from "../../../components/Buttons/AntButton"
import {SaveOutlined} from "@ant-design/icons"
import {Trans} from "react-i18next"
import {useCurrenciesLists, useExchangeConfigUpdateContext, useHandleProfileUpdate, usePairSelectorMenuOpenContext, useUpdatePairSelectorMenuOpenContext} from "../../../context/data/BotExchangeInfoProvider"

export default function SavePairSelector() {
    const setPairSelectorMenuOpen = useUpdatePairSelectorMenuOpenContext()
    const pairSelectorMenuOpen = usePairSelectorMenuOpenContext()
    const {currentCurrencyList, unsavedCurrencyList} = useCurrenciesLists()
    const handleProfileUpdate = useHandleProfileUpdate()
    const exchangeConfigUpdate = useExchangeConfigUpdateContext()
    const exchangeConfigUpdateHasChanged = Boolean(exchangeConfigUpdate.global_config && Object.keys(exchangeConfigUpdate.global_config).length)
    const hasUnsavedChanges = JSON.stringify(unsavedCurrencyList) !== JSON.stringify(currentCurrencyList)

    return useMemo(() => {
        function handleSave(restartAfterSave = true) {
            handleProfileUpdate(restartAfterSave)
            setPairSelectorMenuOpen({open: false, wantsClose: false})
        }
        if (pairSelectorMenuOpen?.open) {
            return (exchangeConfigUpdateHasChanged|| hasUnsavedChanges) && (
                <span style={
                    {
                        margin: "auto",
                        display: "flex",
                        marginRight: "5px"
                    }
                }>
                    <AntButton onClick={()=>handleSave(true)}
                        antIconComponent={SaveOutlined}
                        buttonType={
                            buttonTypes.error
                        }
                        buttonVariant={
                            buttonVariants.primary
                    }>
                        <Trans i18nKey="pairSelector.SaveAndRestart" />                        
                    </AntButton>
                </span>
            )
        } else 
            (
                <></>
            )       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pairSelectorMenuOpen?.open, exchangeConfigUpdateHasChanged, hasUnsavedChanges])
}
