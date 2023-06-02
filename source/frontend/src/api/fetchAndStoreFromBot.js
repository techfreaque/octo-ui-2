import $ from "jquery";
import createNotification from "../components/Notifications/Notification";

export async function sendAndInterpretBotUpdate(updated_data, update_url, success_callback, error_callback, method = "POST", withCredentials, token) {
    const requestData = {
        url: update_url,
        type: method,
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(updated_data),
        crossDomain: true,
        // withCredentials: withCredentials,
        // xhrFields: {
        //     withCredentials: withCredentials
        // },
        // beforeSend: function(xhr){
        //     // xhr.setRequestHeader("header key", "header value")
        // xhr.withCredentials = withCredentials;
        // },
        success: function (msg, status, request) {
            if (typeof success_callback === "undefined") {
                genericRequestSuccessCallback(updated_data, update_url, msg, status)
            } else {
                success_callback(updated_data, update_url, undefined, msg, status, request)
            }
            return updated_data
        },
        error: function (result, status, error) {
            window.console && console.error(result, status, error);
            if (typeof error_callback === "undefined") {
                genericRequestFailureCallback(updated_data, update_url, result, status, error);
            } else {
                error_callback(updated_data, update_url, result, status, error);
            }
        }
    }
    addAuthToAjaxRequest(requestData, withCredentials, token)
    return $.ajax(requestData)
}

function addAuthToAjaxRequest(requestData, withCredentials, token) {
    if (withCredentials && token) {
        requestData.headers = {
            Authorization: 'Bearer ' + token
        }
    }
}

export async function sendFile({
    url,
    file,
    fileName,
    data = {},
    onSuccess,
    onError,
    withCredentials,
    token
}) { // use FormaData to send an object with files
    var formData = new FormData();
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    })
    formData.append('file', file, fileName)
    const requestData = {
        url: url,
        crossDomain: true,
        method: 'POST',
        data: formData, // sends fields with filename mimetype etc
        processData: false, // don't let jquery process the data
        contentType: false,
        success: onSuccess,
        error: onError,
        // let xhr set the content type,
        // success: onSuccess,
        // error: onError,
    }
    addAuthToAjaxRequest(requestData, withCredentials, token)
    $.ajax(requestData);
    // reqest.then((response) => {
    //     response ?. success ? onSuccess ?. (response) : onError ?. (response)
    // })
}
export async function fetchAndGetFromBot(url, type = "get", dataToSend, success_callback, error_callback,) {
    return await sendAndInterpretBotUpdate(dataToSend, url, success_callback, error_callback, type)
}

export async function getFile(url, successCallback, errorCallback) {
    fetch(url).then(res => res.blob()).then(blob => {
        successCallback(blob)
    });
}

export default async function fetchAndStoreFromBot(url, setBotDataFunction, type = "get", dataToSend, successNotification = false, keepPreviousValues = true, setIsFinished = undefined, failNotification = true,) {
    const fail = (updated_data, update_url, result, msg, status) => {
        failNotification && genericRequestFailureCallback(updated_data, update_url, result, msg, status)
        setIsFinished && setIsFinished(true)
    }
    const success = (updated_data, update_url, result, msg, status) => {
        if (msg?.success !== true) {
            fail(updated_data, update_url, result, msg, status)
        } else {
            const data = msg?.data || msg
            keepPreviousValues ? setBotDataFunction((prevData) => ({
                ...prevData,
                ...data
            })) : setBotDataFunction(data)
            successNotification && createNotification(msg?.message || "Successfully fetched data", "success")
            setIsFinished && setIsFinished(true)

        }
    }
    return await sendAndInterpretBotUpdate(dataToSend, url, success, fail, type)
}

function genericRequestSuccessCallback(updated_data, update_url, result, msg, status) {
    defaultSuccessNotification(msg, result)
}

export function defaultSuccessNotification(msg, result) {
    (msg.hasOwnProperty("title") ? createNotification(msg["title"], "success", msg["details"]) : createNotification(result));
}

function genericRequestFailureCallback(updated_data, update_url, result, msg, status) {
    // const isBotConnected = useIsBotOnlineContext()
    // if(isBotConnected()){
    createNotification("Can't connect to OctoBot", "danger", "Your OctoBot might be offline.");
    // }else{
    // createNotification(msg.responseText, "danger");
    // }
}
