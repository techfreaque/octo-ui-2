import { Store } from "react-notifications-component";

export default function createNotification(title, type="success", message) {
  Store.addNotification({
    title: title,
    message: message,
    type: type,
    insert: "top",
    container: "bottom-left",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
}
