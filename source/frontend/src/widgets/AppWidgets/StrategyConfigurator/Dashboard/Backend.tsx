import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  useDeleteStoreUser,
  useGetStorePayments,
  useGetUsers,
} from "../../../../context/data/AppStoreDataProvider";
import { Typography } from "antd";
import { ConfirmAction } from "../AppCards/AppActions/AppActions";

export default function BackendDashboard() {
  const [storeUsers, setStoreUsers] = useState<StoreUsersType>();
  const [storePayments, setStorePayments] = useState<StorePayments>();
  const getStoreUsers = useGetUsers();
  const getStorePayments = useGetStorePayments();
  const deleteUser = useDeleteStoreUser();
  useEffect(() => {
    getStoreUsers(setStoreUsers);
    getStorePayments(setStorePayments);
  }, [getStorePayments, getStoreUsers]);
  return (
    <>
      {storeUsers?.users && (
        <ul>
          <Typography.Title level={4}>Users</Typography.Title>
          {storeUsers.users.map((user) => {
            return (
              <li>
                {`${user.id} ${user.email} (ref id${user.referral_user_id})`}
                <ConfirmAction
                  onConfirm={(setOpen: Dispatch<SetStateAction<boolean>>) =>
                    deleteUser(user.id, () => setOpen(false))
                  }
                  confirmTitle={`Delete ${user.email}`}
                  confirmButtonText={`Delete ${user.email}`}
                  buttonTitle={`Delete ${user.email}`}
                />
              </li>
            );
          })}
        </ul>
      )}
      {storeUsers?.visits && (
        <ul>
          <Typography.Title level={4}>Visits</Typography.Title>
          {storeUsers.visits.map((visit) => {
            return (
              <li>
                {`count: ${visit.visit_counter} - ${visit.origin} (${visit.user_id})`}
              </li>
            );
          })}
        </ul>
      )}
      {storePayments?.payments && (
        <ul>
          <Typography.Title level={4}>Store Payments</Typography.Title>
          {storePayments.payments.map((payment) => {
            return (
              <li>
                {`${payment.id} ${payment.timestamp} ${payment.payment_status} ${payment.user_id} ${payment.payment_id} ${payment.origin_packages} ${payment.payment_timestamp} ${payment.price} ${payment.payment_success_secret} ${payment.payment_cancel_secret} ${payment.payment_url} ${payment.cancel_url} ${payment.subscription_months}`}
              </li>
            );
          })}
        </ul>
      )}
      {storePayments?.subscriptions && (
        <ul>
          <Typography.Title level={4}>Store Payments</Typography.Title>
          {storePayments.subscriptions.map((payment) => {
            return (
              <li>
                {`${payment.id} ${payment.user_id} ${payment.start_timestamp} ${payment.end_timestamp} ${payment.origin_package}`}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export interface StoreUsersType {
  success: boolean;
  users: {
    about_me: null;
    address: null;
    city: null;
    country: null;
    email: string;
    id: number;
    lastname: null;
    name: null;
    referral_user_id: null;
    zip: null;
  }[];
  visits: {
    origin: string;
    user_id: number;
    visit_counter: number;
  }[];
}

export interface StorePayments {
  success: boolean;
  payments: {
    cancel_url: string;
    id: number;
    origin_packages: string;
    payment_cancel_secret: string;
    payment_id: null;
    payment_status: string;
    payment_success_secret: string;
    payment_timestamp: number | null;
    payment_url: string;
    price: number;
    subscription_months: number;
    timestamp: number;
    user_id: number;
  }[];
  subscriptions?: {
    end_timestamp: number;
    id: number;
    origin_package: string;
    start_timestamp: number;
    user_id: number;
  }[];
}
