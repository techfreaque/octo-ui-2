import $ from "jquery";
import createNotification from "../components/Notifications/Notification";
import { useIsBotOnlineContext } from "../context/IsBotOnlineProvider";

export function useSendAndInterpretBotUpdate(updated_data, update_url, success_callback, error_callback, method = "POST") {
  const gnericRequestFailureCallback = useGenericRequestFailureCallback()
  $.ajax({
    url: update_url,
    type: method,
    dataType: "json",
    contentType: 'application/json',
    data: JSON.stringify(updated_data),
    success: function (msg, status) {
      if (typeof error_callback === "undefined") {
        generic_request_success_callback(updated_data, update_url, msg, status)
      } else {
        success_callback(updated_data, update_url, msg, status)
      }
    },
    error: function (result, status, error) {
      window.console && console.error(result, status, error);
      if (typeof error_callback === "undefined") {
        gnericRequestFailureCallback(updated_data, update_url, result, status, error);
      }
      else {
        error_callback(updated_data, update_url, result, status, error);
      }
    }
  })
}

export function generic_request_success_callback(updated_data, update_url, dom_root_element, msg, status) {
  if(msg.hasOwnProperty("title")){
      createNotification(msg["title"], "success", msg["details"]);
  } else {
      createNotification(msg);
  }
}

function useGenericRequestFailureCallback(updated_data, update_url, dom_root_element, msg, status) {
  const isBotConnected = useIsBotOnlineContext()
  if(isBotConnected()){
      createNotification("Can't connect to OctoBot", "danger", "Your OctoBot might be offline.");
  }else{
      createNotification(msg.responseText, "danger");
  }
}

export default async function fetchAndStoreFromBot(
  url,
  setBotDataFunction,
  type = "get",
  dataToSend
) {
  if (type === "get") {
    getRequest(url).then((newData) => {
      setBotDataFunction(newData);
    });
  } else if (type === "post") {
    postRequest(url, dataToSend).then((newData) => {
      setBotDataFunction((prevData) => {
        return { ...prevData, ...newData };
      });
    });
  }
}

export async function postRequest(url, data) {
  const res = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response = await res.json();
  return response;
}

async function getRequest(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}
