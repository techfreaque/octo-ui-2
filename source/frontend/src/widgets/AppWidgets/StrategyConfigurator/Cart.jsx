import {Space, Typography} from "antd"
import {
    useAppStoreCartContext,
    useAppStoreCartIsOpenContext,
    useAppStorePaymentUrlContext,
    useCancelStorePayment,
    useCreatePaymentFromAppStoreCart,
    useRemoveFromAppStoreCart,
    useUpdateAppStoreCartIsOpenContext
} from "../../../context/data/AppStoreDataProvider"
import ButtonWithModal from "../Modals/ButtonWithModal"
import AntTable from "../../../components/Tables/AntTable"
import AntButton, {buttonSizes, buttonTypes} from "../../../components/Buttons/AntButton"
import {CloseCircleOutlined, DollarCircleOutlined} from "@ant-design/icons"
import {Refresh} from "@mui/icons-material"

export default function AppStoreCartModal({content}) {
    const appStoreCart = useAppStoreCartContext()
    const open = useAppStoreCartIsOpenContext()
    const setOpen = useUpdateAppStoreCartIsOpenContext()
    return(appStoreCart && Object.keys(appStoreCart)?.length > 0) && (
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

export function AppStoreCart({setIsloading}) {
    const appStoreCart = useAppStoreCartContext()
    const removeFromCart = useRemoveFromAppStoreCart()
    const createPaymentFromAppStoreCart = useCreatePaymentFromAppStoreCart()
    const cancelStorePayment = useCancelStorePayment()
    const appStorePaymentUrl = useAppStorePaymentUrlContext()
    let totalPrice = 0
    const cartList = Object.keys(appStoreCart).map(originPackage => {
        const firstAppInPackage = appStoreCart[originPackage][Object.keys(appStoreCart[originPackage])[0]]
        totalPrice += firstAppInPackage.price * 12
        return {
            ...firstAppInPackage,
            key: originPackage,
            price: `${
                firstAppInPackage.price
            }$ / month`,
            months: 12,
            total: `${
                12 * firstAppInPackage.price
            }$`,
            action: (
                <AntButton antIconComponent={CloseCircleOutlined}
                    buttonType={
                        buttonTypes.warning
                    }
                    onClick={
                        () => removeFromCart(originPackage)
                }>Remove from Basket</AntButton>
            )
        }
    })
    return (
        <div>
            <Typography.Title level={2}>
                {
                appStorePaymentUrl ? "Complete your purchase" : "Shopping Basket"
            } </Typography.Title>
            <AntTable maxWidth="100%"
                columns={
                    getCartItemsColumns(appStorePaymentUrl)
                }
                data={cartList}/>
            <div style={
                {
                    marginLeft: "auto",
                    maxWidth: "400px",
                    textAlign: "right"
                }
            }>
                <Typography.Title level={4}>
                    {
                    `Total: ${totalPrice}$ (incl. Tax)`
                } </Typography.Title>
                {
                appStorePaymentUrl ? (
                    <Space>
                        <Space>
                            <AntButton size={
                                    buttonSizes.large
                                }
                                // onClick={}
                                antIconComponent={Refresh}>
                                No Payment Detected - Check Payment Status
                            </AntButton>
                        </Space>
                        <Space>
                            <AntButton buttonType={
                                    buttonTypes.warning
                                }
                                size={
                                    buttonSizes.large
                                }
                                onClick={cancelStorePayment}
                                antIconComponent={CloseCircleOutlined}>
                                Cancel Purchase
                            </AntButton>
                            <AntButton href={
                                    appStorePaymentUrl.paymentUrl
                                }
                                size={
                                    buttonSizes.large
                                }
                                antIconComponent={DollarCircleOutlined}
                                target="blank">
                                Finalize Payment
                            </AntButton>
                        </Space>
                    </Space>
                ) : (
                    <Space>
                        <AntButton antIconComponent={DollarCircleOutlined}
                            size={
                                buttonSizes.large
                            }
                            onClick={
                                () => createPaymentFromAppStoreCart(undefined, Object.keys(appStoreCart))
                        }>
                            Complete Purchase & Pay Now
                        </AntButton>
                    </Space>
                )
            } </div>
        </div>
    )
}

function getCartItemsColumns(appStorePaymentUrl) {

    return [
        {
            title: 'Package Name',
            dataIndex: 'origin_package',
            key: 'origin_package'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Months',
            dataIndex: 'months',
            key: 'months'
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total'
        },
        (appStorePaymentUrl ? {} : {
            title: 'Action',
            dataIndex: 'action',
            key: 'action'
        }),
    ];

}
