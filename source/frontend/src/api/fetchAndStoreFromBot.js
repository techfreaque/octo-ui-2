import $ from "jquery";
import createNotification from "../components/Notifications/Notification";
// import { useIsBotOnlineContext } from "../context/IsBotOnlineProvider";

export async function sendAndInterpretBotUpdate(updated_data, update_url, success_callback, error_callback, method = "POST") {
  return $.ajax({
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
      return updated_data
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

export async function fetchAndGetFromBot(
  url,
  type = "get",
  dataToSend,
  success_callback,
  error_callback,

) {
  return await sendAndInterpretBotUpdate(dataToSend, url, success_callback, error_callback, type)
}

export default async function fetchAndStoreFromBot(
  url,
  setBotDataFunction,
  type = "get",
  dataToSend,
  successNotification = false,
  keepPreviousValues = true,
  setIsFinished = undefined,
  failNotification = true,
) {
  const fail = (updated_data, update_url, result, msg, status) => {
    failNotification && genericRequestFailureCallback(updated_data, update_url, result, msg, status)
    setIsFinished && setIsFinished(true)
  }
  const success = (updated_data, update_url, result, msg, status) => {
    if (msg?.success !== true) {
      fail(updated_data, update_url, result, msg, status)
    } else {
      const data = msg?.data || msg
      keepPreviousValues ? setBotDataFunction((prevData) => ({ ...prevData, ...data }))
        : setBotDataFunction(data)
      successNotification && createNotification(
        msg?.message || "Successfully fetched data", "success")
      setIsFinished && setIsFinished(true)

    }
  }
  return await sendAndInterpretBotUpdate(dataToSend, url, success, fail, type)
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