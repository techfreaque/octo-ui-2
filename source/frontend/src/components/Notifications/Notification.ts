import type {
  iNotification,
  NOTIFICATION_TYPE,
} from "react-notifications-component";
import { Store } from "react-notifications-component";

export default function createNotification({
  title,
  type = "success",
  message,
  duration = 10_000,
  // dismiss = true,
}: {
  title: string;
  type?: NOTIFICATION_TYPE;
  message?: string | JSX.Element | undefined;
  duration?: number;
  // dismiss?: boolean;
}) {
  const newNotification: iNotification = {
    title,
    message,
    type,
    insert: "top",
    container: "bottom-left",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration,
    },
  };
  Store.addNotification(newNotification);
}
