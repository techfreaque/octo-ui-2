import React from "react";
import fetchBotData from "../../data/botData";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page from "../Page";
import NotFoundPage from "../NotFoundPage";
import { defaultBotTemplate, defaultColors } from "../../widgets/LayoutTemplate"


export default function Octobot(props) {
    const [botDomain, setBotDomain] = React.useState("http://192.168.18.6:5003")
    const [mainBotData, setMainBotData] = React.useState({time_frames:{}, symbols:[], exchange_id: ""})
    const [botPlotData, setBotPlotData] = React.useState()
    const [colors, setColors] = React.useState(defaultColors)
    const [pages, setPages] = React.useState(defaultBotTemplate)
    
    const botDataManager = {
        mainBotData: mainBotData, setMainBotData: setMainBotData,
        botPlotData: botPlotData, setBotPlotData: setBotPlotData,
        pages: pages, setPages: setPages,
        colors: colors, setColors: setColors,
        botDomain: botDomain, setBotDomain: setBotDomain
    }

    React.useEffect(() => {
            fetchBotData(botDataManager)
    }, [])
      
    return (
        <BrowserRouter>
            <Routes>
                {pages.map(page => {
                    return (
                        <Route 
                            key={page.path} 
                            exact
                            path={page.path} 
                            element={
                                <Page key={page.path} currentPage={page} 
                                        botDataManager={botDataManager}
                                />
                            } 
                        />
                        )
                    })}
                <Route key="notFound" path="*" element={<NotFoundPage/>} />
            </Routes>
        </BrowserRouter>
    );
}