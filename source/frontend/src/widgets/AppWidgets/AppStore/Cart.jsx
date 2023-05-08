import {useAppStoreCartContext} from "../../../context/data/AppStoreDataProvider"
import ButtonWithModal from "../Modals/ButtonWithModal"

export default function AppStoreCartModal({content}) {
    const appStoreCart = useAppStoreCartContext()
    return appStoreCart && (<ButtonWithModal title={"Shopping Cart"}
        content={
            content
        }
        antIcon={"ShoppingCartOutlined"}
        iconOnly={true}
        // displayAsAvatar={displayAsAvatar}
        width={"1000"}/>)
}

export function AppStoreCart() {
    const appStoreCart = useAppStoreCartContext()
    return (<div>
    {JSON.stringify(appStoreCart)}
</div>)
}