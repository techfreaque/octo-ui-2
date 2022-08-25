
export default function fetchBotData (botDataManager) {
    fetch(botDataManager.botDomain+"/api_backend/bot-info", 
  {method: "GET", mode: 'cors', headers: {'Content-Type': 'application/json'}})
          .then(res => res.json())
          .then(data => {
            botDataManager.setMainBotData(data)
            fetchPlotData (botDataManager.setBotPlotData, data.exchange_id, 
                            data.symbols[0], data.traded_time_frames[0], botDataManager.botDomain)
          })
}

function fetchPlotData (setBotPlotData, exchange_id, symbol, time_frame, botDomain) {
    const url = `${botDomain}/api_backend/plotted_data?exchange_id=${exchange_id}&symbol=${symbol}&time_frame=${time_frame}`
  	fetch(url, 
    {method: "GET", test: JSON.stringify({"exchange_id": "test"}),
    mode: 'cors', headers: {'Content-Type': 'application/json'}})
            .then(res => res.json())
            .then(data => {              
                setBotPlotData(data.data.sub_elements[0].data.elements)

            })
}
