import {
  NOTIFICATION_TYPE,
  Store,
  iNotification,
} from "react-notifications-component";

export default function createNotification({
  title,
  type = "success",
  message,
  duration = 5000,
  dismiss = true,
}: {
  title: string;
  type?: NOTIFICATION_TYPE;
  message?: string | JSX.Element;
  duration?: number;
  dismiss?: boolean;
}) {
  const newNotification: iNotification = {
    title,
    message,
    type,
    insert: "top",
    container: "bottom-left",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
  };
  if (!dismiss) {
    newNotification.dismiss = {
      duration,
    };
  }
  Store.addNotification(newNotification);
}
