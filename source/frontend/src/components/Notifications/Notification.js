import {Store} from "react-notifications-component";

export default function createNotification(title, type = "success", message, duration = 5000, dismiss = true) {
    const newNotification = {
        title,
        message,
        type,
        insert: "top",
        container: "bottom-left",
        animationIn: [
            "animate__animated", "animate__fadeIn"
        ],
        animationOut: [
            "animate__animated", "animate__fadeOut"
        ],
        // dismiss: {
        // },
    }
    if (dismiss || duration) {
        newNotification.dismiss = {}
    }
    if (duration) {
        newNotification.dismiss.duration = duration
    }
    if (dismiss) {
        newNotification.dismiss.dismiss = dismiss
    }
    Store.addNotification(newNotification);
}
