import Page from "../Page";
import NotFoundPage from "../NotFoundPage";
import { useBotLayoutContext } from "../../context/BotLayoutProvider";
import React from "react";
import { Route, Routes } from "react-router-dom";

export default function Pages(props){
    const botLayout = useBotLayoutContext()
    return (
        <Routes>
            {botLayout.map(page => {
                return (
                    <Route 
                        key={page.path} 
                        exact
                        path={page.path} 
                        element={
                            <Page key={page.path} currentPage={page} 
                                    botDataManager={props.botDataManager}
                            />
                        } 
                    />
                    )
                })
            }
            <Route key="notFound" path="*" element={<NotFoundPage/>} />
        </Routes>
    )
}