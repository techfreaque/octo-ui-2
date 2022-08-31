import React from 'react';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Pages from "../Pages/Pages";
import BotDataProvider from "../../context/BotDataProvider";

import 'bootstrap/dist/css/bootstrap.min.css';

const AppWrapper = styled.div`
 height: 100%;
 width: 100%;
`;

export default function App() {
  return (
    <AppWrapper>
        <BrowserRouter>
            <ReactNotifications/>
            <BotDataProvider defaultDomain={"http://192.168.18.6:5003"}>
                <Pages/>
            </BotDataProvider>
        </BrowserRouter>
    </AppWrapper>
  );
}
 