import {useAppStoreCartContext, useAppStoreCartIsOpenContext, useUpdateAppStoreCartIsOpenContext} from "../../../context/data/AppStoreDataProvider"
import ButtonWithModal from "../Modals/ButtonWithModal"

export default function AppStoreCartModal({content}) {
    const appStoreCart = useAppStoreCartContext()
    const open = useAppStoreCartIsOpenContext()
    const setOpen = useUpdateAppStoreCartIsOpenContext()
    return(appStoreCart && Object.keys(appStoreCart) ?. length > 0) && (
        <ButtonWithModal title={"Shopping Cart"}
            content={content}
            open={open}
            setOpen={setOpen}
            antIcon={"ShoppingCartOutlined"}
            iconOnly={true}
            // displayAsAvatar={displayAsAvatar}
            width={"1000"}/>
    )
}

export function AppStoreCart() {
    const appStoreCart = useAppStoreCartContext()
    return (
        <div> {
            JSON.stringify(appStoreCart)
        } </div>
    )
}
