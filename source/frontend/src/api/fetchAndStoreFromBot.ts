import type { Dispatch, SetStateAction } from "react";

import createNotification from "../components/Notifications/Notification";
import { projectName } from "../constants/frontendConstants";
import type { AnyType } from "../helpers/helpers";

export async function sendAndInterpretBotUpdate({
  updatedData,
  updateUrl,
  successCallback,
  errorCallback,
  method = "POST",
  withCredentials,
  token,
}: {
  updatedData?: AnyType;
  updateUrl: string;
  successCallback?:
    | ((payload: successResponseCallBackParams) => void)
    | undefined;
  errorCallback?: ((payload: errorResponseCallBackParams) => void) | undefined;
  method?: "POST" | "GET";
  withCredentials?: boolean;
  token?: string | undefined;
}): Promise<void> {
  const requestData: RequestInit = {
    method,
    // mode: "cors",
    // credentials: withCredentials ? "include" : "same-origin",
  };
  if (method === "POST") {
    requestData.headers = {
      "Content-Type": "application/json",
    };
    requestData.body = JSON.stringify(updatedData);
  }
  addAuthToRequest(requestData, withCredentials, token);
  try {
    const response = await fetch(updateUrl, requestData);
    const data = await response.json();

    if (response.ok) {
      if (successCallback) {
        successCallback({
          updatedData,
          updateUrl,
          data,
          response,
        });
      } else {
        genericRequestSuccessCallback({
          updatedData,
          updateUrl,
          data,
          response,
        });
      }
    } else if (errorCallback) {
      errorCallback({ updatedData, updateUrl, data, response });
    } else {
      genericRequestFailureCallback({
        updatedData,
        updateUrl,
        data,
        response,
      });
    }
  } catch (error) {
    if (errorCallback) {
      errorCallback({ updatedData, updateUrl, data: error });
    } else {
      genericRequestFailureCallback({ updatedData, updateUrl, data: error });
    }
  }
}

function addAuthToRequest(
  requestData: RequestInit,
  withCredentials?: boolean,
  token?: string
): void {
  if (withCredentials && token) {
    requestData.headers = {
      ...requestData.headers,
      Authorization: `Bearer ${token}`,
    };
  }
}

export async function sendFile({
  url,
  file,
  fileName,
  data,
  onSuccess,
  onError,
  withCredentials,
  token,
}: {
  url: string;
  file: Blob;
  fileName: string;
  data?: {
    [key: string]: string | boolean | undefined | number | string[];
  };
  onSuccess: (responseData: unknown) => void;
  onError: (error: unknown) => void;
  withCredentials: boolean;
  token: string;
}) {
  // use FormaData to send an object with files
  const formData = new FormData();
  data &&
    Object.keys(data).forEach((key) => {
      formData.append(key, String(data[key]));
    });
  formData.append("file", file, fileName);
  const requestData: RequestInit = {
    method: "POST",
    body: formData,
    credentials: withCredentials ? "include" : "same-origin",
    headers:
      withCredentials && token ? { Authorization: `Bearer ${token}` } : {},
  };
  addAuthToRequest(requestData, withCredentials, token);
  try {
    const response = await fetch(url, requestData);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    if (onSuccess) {
      onSuccess(responseData);
    }
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      console.error("Error:", error);
    }
  }
}

export async function getFile({
  url,
  successCallback,
  errorCallback,
}: {
  url: string;
  successCallback: (blob: Blob) => void;
  errorCallback?: (error: unknown) => void;
}) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      successCallback(blob);
    })
    .catch((error) => errorCallback?.(error));
}

export default async function fetchAndStoreFromBot({
  url,
  setBotDataFunction,
  method = "GET",
  dataToSend,
  successNotification = false,
  keepPreviousValues = true,
  setIsFinished,
  failNotification = true,
}: {
  url: string;
  setBotDataFunction: Dispatch<SetStateAction<AnyType>>;
  method?: "GET" | "POST";
  dataToSend?: AnyType;
  successNotification?: boolean | undefined;
  keepPreviousValues?: boolean | undefined;
  setIsFinished?: Dispatch<SetStateAction<boolean>> | undefined;
  failNotification?: boolean | undefined;
}) {
  function errorCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: errorResponseCallBackParams) {
    if (failNotification) {
      genericRequestFailureCallback({
        updatedData,
        updateUrl,
        data,
        response,
      });
    }
    setIsFinished?.(true);
  }
  function successCallback({
    updatedData,
    updateUrl,
    data,
    response,
  }: successResponseCallBackParams) {
    if (data?.success === true) {
      const _data = data?.data || data;
      if (keepPreviousValues) {
        setBotDataFunction((prevData: object) => ({
          ...prevData,
          ..._data,
        }));
      } else {
        setBotDataFunction(_data);
      }
      if (successNotification) {
        createNotification({
          title: _data?.message || "Successfully fetched data",
        });
      }
      setIsFinished?.(true);
      return;
    }
    errorCallback({
      updatedData,
      updateUrl,
      data,
      response,
    });
  }
  return await sendAndInterpretBotUpdate({
    updatedData: dataToSend,
    updateUrl: url,
    successCallback,
    errorCallback,
    method,
  });
}

export interface successResponseCallBackParams {
  updatedData: AnyType;
  updateUrl: string;
  data: AnyType;
  response: Response;
}

export interface errorResponseCallBackParams {
  updatedData: AnyType;
  updateUrl: string;
  data: AnyType;
  response?: Response | undefined;
}

function genericRequestSuccessCallback({
  updateUrl,
  data,
}: successResponseCallBackParams) {
  defaultSuccessNotification(data, updateUrl);
}

export function defaultSuccessNotification(data: AnyType, updateUrl: string) {
  if (data?.title) {
    createNotification({ title: data.title, message: data?.details });
  } else {
    console.warn(`Unknown API Notification: Url: ${updateUrl}, Data: `, data);
    createNotification({
      title: "Unknown Notification",
      message: `Url: ${updateUrl}, Data: ${JSON.stringify(data)}`,
    });
  }
}

function genericRequestFailureCallback({
  updateUrl,
  data,
}: errorResponseCallBackParams) {
  console.error(
    `Unknown API connect error: Update url: ${updateUrl}, error: `,
    data
  );
  createNotification({
    title: `Can't connect to ${  projectName}`,
    type: "danger",
    message: `Unknown error: Update url: ${updateUrl}, error: ${JSON.stringify(
      data
    )}`,
  });
}
