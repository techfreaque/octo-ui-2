import {useMemo} from "react"
import AntButton, {buttonVariants} from "../../../components/Buttons/AntButton"
import {CloseOutlined} from "@ant-design/icons"
import {AntIconByReactFunc} from "../../../components/Icons/AntIcon"
import {sizes} from "../../../constants/frontendConstants"
import {Tooltip} from "antd"
import {Trans} from "react-i18next"
import {usePairSelectorMenuOpenContext, useUpdatePairSelectorMenuOpenContext} from "../../../context/data/BotExchangeInfoProvider"

export default function ClosePairSelector() {
    const setPairSelectorMenuOpen = useUpdatePairSelectorMenuOpenContext()
    const pairSelectorMenuOpen = usePairSelectorMenuOpenContext()
    return useMemo(() => {
        if (pairSelectorMenuOpen?.open) {
            return (
                    <span style={
                        {
                        margin: "auto",
                        display: "flex",
                            marginRight: "5px"
                        }
                    }>
                        <Tooltip placement="bottom"
                            title={
                                <Trans
                            i18nKey="buttons.closePairSelectorTooltip"/>
                            }
                            arrow={false}>
                            <div>
                                <AntButton onClick={
                                        (() => setPairSelectorMenuOpen({open: false, wantsClose: false}))
                                    }
                                    buttonVariant={
                                        buttonVariants.text
                                }>
                                    <AntIconByReactFunc AntReactIcon={CloseOutlined}
                                        size={
                                            sizes.medium
                                        }/>
                                </AntButton>
                            </div>
                        </Tooltip>
                    </span>
            );
        } else 
            (
                <></>
            )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pairSelectorMenuOpen?.open])
}
