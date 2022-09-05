async function postRequest(url, data) {
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
