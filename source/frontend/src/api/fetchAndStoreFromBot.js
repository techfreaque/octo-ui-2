import $ from "jquery";
import createNotification from "../components/Notifications/Notification";
// import { useIsBotOnlineContext } from "../context/IsBotOnlineProvider";

export function sendAndInterpretBotUpdate(updated_data, update_url, success_callback, error_callback, method = "POST") {
  // const gnericRequestFailureCallback = useGenericRequestFailureCallback()
  $.ajax({
    url: update_url,
    type: method,
    dataType: "json",
    contentType: 'application/json',
    data: JSON.stringify(updated_data),
    success: function (msg, status) {
      if (typeof success_callback === "undefined") {
        genericRequestSuccessCallback(updated_data, update_url, msg, status)
      } else {
        success_callback(updated_data, update_url, undefined, msg, status)
      }
    },
    error: function (result, status, error) {
      window.console && console.error(result, status, error);
      if (typeof error_callback === "undefined") {
        genericRequestFailureCallback(updated_data, update_url, result, status, error);
      }
      else {
        error_callback(updated_data, update_url, result, status, error);
      }
    }
  })
}

export default async function fetchAndStoreFromBot(
  url,
  setBotDataFunction,
  type = "get",
  dataToSend,
  successNotification = false,
  keepPreviousValues = true
) {
  const success = (updated_data, update_url, result, msg, status) => {
    keepPreviousValues ? setBotDataFunction((prevData) => ({ ...prevData, ...msg }))
      : setBotDataFunction(msg)
    successNotification && defaultSuccessNotification(msg, result)
  }
  sendAndInterpretBotUpdate(dataToSend, url, success, undefined, type)
}

function genericRequestSuccessCallback(updated_data, update_url, result, msg, status) {
  defaultSuccessNotification(msg, result)
}

export function defaultSuccessNotification(msg, result) {
  (msg.hasOwnProperty("title")
    ? createNotification(msg["title"], "success", msg["details"])
    : createNotification(result));
}

function genericRequestFailureCallback(updated_data, update_url, result, msg, status) {
  // const isBotConnected = useIsBotOnlineContext()
  // if(isBotConnected()){
  createNotification("Can't connect to OctoBot", "danger", "Your OctoBot might be offline.");
  // }else{
  // createNotification(msg.responseText, "danger");
  // }
}