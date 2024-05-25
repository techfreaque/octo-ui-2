import {
  CloseCircleOutlined,
  DollarCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Space, Typography } from "antd";
import { t } from "i18next";
import { useEffect } from "react";
import { Trans } from "react-i18next";

import AntButton, {
  buttonSizes,
  buttonTypes,
} from "../../../components/Buttons/AntButton";
import AntTable, {
  AntTableColumnType,
  AntTableDataType,
} from "../../../components/Tables/AntTable";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { UiLayoutPageLayoutType } from "../../../context/config/BotLayoutProvider";
import {
  AppStoreCartType,
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
        title={t("appStore.cart.shopping-cart")}
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
          throw new Error(
            t("appStore.cart.no-app-in-package-originpackagename", {
              originPackageName,
            })
          );
        }
        if (!firstAppInPackage.price) {
          throw new Error(
            t("appStore.cart.no-price-for-firstappinpackage-package_id", {
              packageId: firstAppInPackage.package_id,
            })
          );
        }
        totalPrice += firstAppInPackage.price * 12;
        return {
          ...firstAppInPackage,
          id: originPackageName,
          key: originPackageName,
          price: t('appStore.cart.firstappinpackage-price-month', { price: firstAppInPackage.price }),
          months: 12,
          total: `${12 * firstAppInPackage.price}$`,
          action: (
            <AntButton
              antIconComponent={CloseCircleOutlined}
              buttonType={buttonTypes.warning}
              onClick={() => {
                if (appStorePaymentUrl) {
                  cancelStorePayment();
                }
                removeFromCart(originPackageName);
              }}
            >
              <Trans i18nKey="appStore.cart.remove-from-basket"></Trans>
            </AntButton>
          ),
        };
      })
    : [];
  return (
    <div>
      <Typography.Title level={2}>
        {appStorePaymentUrl
          ? t("appStore.cart.title.complete-your-purchase")
          : t("appStore.cart.title.shopping-basket")}
      </Typography.Title>
      <AntTable
        maxWidth="100%"
        columns={getCartItemsColumns()}
        data={cartList}
      />
      <div
        style={{
          marginLeft: "auto",
          textAlign: "right",
        }}
      >
        <Typography.Title level={4}>
          {t('appStore.cart.total-totalprice-incl-tax', { totalPrice })}
        </Typography.Title>
        {appStorePaymentUrl ? (
          <Space>
            <Space>
              <AntButton
                size={buttonSizes.large}
                onClick={checkStorePayment}
                antIconComponent={ReloadOutlined}
              >
                <Trans i18nKey="appStore.cart.no-payment-detected-check-payment-status"></Trans>
              </AntButton>
            </Space>
            <Space>
              <AntButton
                buttonType={buttonTypes.warning}
                size={buttonSizes.large}
                onClick={() => cancelStorePayment()}
                antIconComponent={CloseCircleOutlined}
              >
                <Trans i18nKey="appStore.cart.cancel-purchase"></Trans>
              </AntButton>
              <AntButton
                href={appStorePaymentUrl.paymentUrl}
                size={buttonSizes.large}
                antIconComponent={DollarCircleOutlined}
                target="blank"
              >
                <Trans i18nKey="appStore.cart.finalize-payment"></Trans>
              </AntButton>
            </Space>
          </Space>
        ) : (
          <Space>
            <AntButton
              antIconComponent={DollarCircleOutlined}
              size={buttonSizes.large}
              onClick={() =>
                appStoreCart &&
                createPaymentFromAppStoreCart(
                  Object.keys(appStoreCart),
                  undefined
                )
              }
            >
              <Trans i18nKey="appStore.cart.complete-purchase-and-pay-now"></Trans>
            </AntButton>
          </Space>
        )}
      </div>
    </div>
  );
}

function getCartItemsColumns(): AntTableColumnType<AntTableDataType>[] {
  const items = [
    {
      title: t('appStore.cart.cart-table.package-name'),
      dataIndex: "origin_package",
      key: "origin_package",
    },
    {
      title: t('appStore.cart.cart-table.price'),
      dataIndex: "price",
      key: "price",
    },
    {
      title: t('appStore.cart.cart-table.months'),
      dataIndex: "months",
      key: "months",
    },
    {
      title: t('appStore.cart.cart-table.total'),
      dataIndex: "total",
      key: "total",
    },
    {
      title: t('appStore.cart.cart-table.action'),
      dataIndex: "action",
      key: "action",
    },
  ];
  return items;
}
