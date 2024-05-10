import { Space, Typography } from "antd";
import {
  AppStoreCartType,
  AppStorePaymentUrlType,
  useAppStoreCartContext,
  useAppStoreCartIsOpenContext,
  useAppStorePaymentUrlContext,
  useCancelStorePayment,
  useCheckStorePayment,
  useCreatePaymentFromAppStoreCart,
  useRemoveFromAppStoreCart,
  useUpdateAppStoreCartIsOpenContext,
} from "../../../context/data/AppStoreDataProvider";
import ButtonWithModal from "../Modals/ButtonWithModal";
import AntTable, {
  AntTableColumnType,
  AntTableDataType,
} from "../../../components/Tables/AntTable";
import AntButton, {
  buttonSizes,
  buttonTypes,
} from "../../../components/Buttons/AntButton";
import { CloseCircleOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { Refresh } from "@mui/icons-material";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { useEffect } from "react";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";

export default function AppStoreCartModal({ content }: UiLayoutPageLayoutType) {
  const appStoreCart = useAppStoreCartContext();
  const open = useAppStoreCartIsOpenContext();
  const setOpen = useUpdateAppStoreCartIsOpenContext();
  const botColors = useBotColorsContext();
  const checkStorePayment = useCheckStorePayment();
  const appStorePaymentUrl = useAppStorePaymentUrlContext();
  useEffect(() => {
    if (appStorePaymentUrl) {
      checkStorePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    appStoreCart &&
    Object.keys(appStoreCart)?.length > 0 && (
      <ButtonWithModal
        title={"Shopping Cart"}
        content={content}
        open={open}
        setOpen={setOpen}
        iconStyle={{
          color: botColors?.warning,
        }}
        antIcon={"ShoppingCartOutlined"}
        iconOnly={true}
        // displayAsAvatar={displayAsAvatar}
        width={"1000"}
      />
    )
  );
}

export function AppStoreCart() {
  const appStoreCart: AppStoreCartType = useAppStoreCartContext();
  const removeFromCart = useRemoveFromAppStoreCart();
  const createPaymentFromAppStoreCart = useCreatePaymentFromAppStoreCart();
  const cancelStorePayment = useCancelStorePayment();
  const checkStorePayment = useCheckStorePayment();
  const appStorePaymentUrl = useAppStorePaymentUrlContext();
  let totalPrice = 0;
  const cartList: AntTableDataType[] = appStoreCart
    ? Object.entries(appStoreCart).map(([originPackageName, originPackage]) => {
        const firstAppKeyInPackage = Object.keys(originPackage)[0];
        const firstAppInPackage = firstAppKeyInPackage
          ? originPackage[firstAppKeyInPackage]
          : undefined;
        if (!firstAppInPackage) {
          throw new Error(`No app in package ${originPackageName}`);
        }
        if (!firstAppInPackage.price) {
          throw new Error(`No price for ${firstAppInPackage.package_id}`);
        }
        totalPrice += firstAppInPackage.price * 12;
        return {
          ...firstAppInPackage,
          id: originPackageName,
          key: originPackageName,
          price: `${firstAppInPackage.price}$ / month`,
          months: 12,
          total: `${12 * firstAppInPackage.price}$`,
          action: (
            <AntButton
              antIconComponent={CloseCircleOutlined}
              buttonType={buttonTypes.warning}
              onClick={() => removeFromCart(originPackageName)}
            >
              Remove from Basket
            </AntButton>
          ),
        };
      })
    : [];
  return (
    <div>
      <Typography.Title level={2}>
        {appStorePaymentUrl ? "Complete your purchase" : "Shopping Basket"}
      </Typography.Title>
      <AntTable
        maxWidth="100%"
        columns={getCartItemsColumns(appStorePaymentUrl)}
        data={cartList}
      />
      <div
        style={{
          marginLeft: "auto",
          textAlign: "right",
        }}
      >
        <Typography.Title level={4}>
          {`Total: ${totalPrice}$ (incl. Tax)`}
        </Typography.Title>
        {appStorePaymentUrl ? (
          <Space>
            <Space>
              <AntButton
                size={buttonSizes.large}
                onClick={checkStorePayment}
                muiIconComponent={Refresh}
              >
                No Payment Detected - Check Payment Status
              </AntButton>
            </Space>
            <Space>
              <AntButton
                buttonType={buttonTypes.warning}
                size={buttonSizes.large}
                onClick={() => cancelStorePayment()}
                antIconComponent={CloseCircleOutlined}
              >
                Cancel Purchase
              </AntButton>
              <AntButton
                href={appStorePaymentUrl.paymentUrl}
                size={buttonSizes.large}
                antIconComponent={DollarCircleOutlined}
                target="blank"
              >
                Finalize Payment
              </AntButton>
            </Space>
          </Space>
        ) : (
          <Space>
            <AntButton
              antIconComponent={DollarCircleOutlined}
              size={buttonSizes.large}
              onClick={() =>
                createPaymentFromAppStoreCart(
                  appStoreCart && Object.keys(appStoreCart),
                  undefined
                )
              }
            >
              Complete Purchase & Pay Now
            </AntButton>
          </Space>
        )}
      </div>
    </div>
  );
}

function getCartItemsColumns(
  appStorePaymentUrl: AppStorePaymentUrlType | undefined
): AntTableColumnType<AntTableDataType>[] {
  const items = [
    {
      title: "Package Name",
      dataIndex: "origin_package",
      key: "origin_package",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Months",
      dataIndex: "months",
      key: "months",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];
  if (appStorePaymentUrl) {
    items.push({
      title: "Action",
      dataIndex: "action",
      key: "action",
    });
  }
  return items;
}
