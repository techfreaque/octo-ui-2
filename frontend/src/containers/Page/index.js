import React from "react";
import { Helmet } from "react-helmet";
import LayoutWidgets from "../../widgets/LayoutWidgets";

export default function Page(props) {
    return (
        <main style={{backgroundColor: props.botDataManager.colors.background, 
                        color:  props.botDataManager.colors.font
            }}
        >
            <Helmet defaultTitle={props.currentPage.title +" - OctoBot"}>
                <meta name="description" content="OctoBot trading bot" />
            </Helmet>
            <LayoutWidgets {...props}/>
        </main>
    )
}