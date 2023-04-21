import {useMemo} from "react"
import AntButton, {buttonTypes, buttonVariants} from "../../../components/Buttons/AntButton"
import {SaveOutlined} from "@ant-design/icons"
import {Trans} from "react-i18next"
import {useCurrenciesLists, useHandleProfileUpdate, usePairSelectorMenuOpenContext, useUpdatePairSelectorMenuOpenContext} from "../../../context/data/BotExchangeInfoProvider"

export default function SavePairSelector() {
    const setPairSelectorMenuOpen = useUpdatePairSelectorMenuOpenContext()
    const pairSelectorMenuOpen = usePairSelectorMenuOpenContext()
    const {currentCurrencyList, unsavedCurrencyList} = useCurrenciesLists()
    const handleProfileUpdate = useHandleProfileUpdate()
    return useMemo(() => {
        const hasUnsavedChanges = JSON.stringify(unsavedCurrencyList) !== JSON.stringify(currentCurrencyList)
        function handleSave(restartAfterSave = true) {
            handleProfileUpdate(restartAfterSave)
            setPairSelectorMenuOpen({open: false, wantsClose: false})
        }
        if (pairSelectorMenuOpen?.open) {
            return hasUnsavedChanges && (
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
    }, [unsavedCurrencyList, currentCurrencyList, pairSelectorMenuOpen?.open, handleProfileUpdate])
}
