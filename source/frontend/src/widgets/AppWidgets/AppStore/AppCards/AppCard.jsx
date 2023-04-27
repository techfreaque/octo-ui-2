import {Card} from "antd";
import {CardAvatar, CardCover, CardTitle} from "./CardComponents";
import {useBotColorsContext} from "../../../../context/config/BotColorsProvider";
import RatingComponent from "./Rating";
import { CardDescription } from "./AppDescription";

export default function AppCard({
    app,
    setMouseHover,
    cardActions,
    isMouseHover,
    avatarUrl,
    category
}) {
    const botColors = useBotColorsContext()
    const boxShadowColor = (app?.is_selected || isMouseHover) ? botColors?.borderActive : "rgb(0 0 0 / 24%)"
    const cardStyle = {
        boxShadow: `0px 0px 3px ${boxShadowColor}`,
        borderRadius: "4px",
        transition: "all 200ms linear 0ms"
    }
    if (isMouseHover) {
        cardStyle.transform = "translateY(-1px)"
    }

    return (
        <Card
            // hoverable
            style={cardStyle}
            cover={
                (
                    <CardCover avatarImage={'https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png'}
                        app={app}/>
                )
            }
            onMouseEnter={
                () => setMouseHover(true)
            }
            onMouseLeave={
                () => setMouseHover(false)
        }>
            <div>
                <Card.Meta avatar={
                        (
                            <>
                                <CardAvatar avatarImage={avatarUrl}/>
                            </>
                        )
                    }
                    title={
                        (
                            <CardTitle title={
                                app.title
                            }/>
                        )
                    }/> 
             
                    <div style={
                        {
                            marginLeft: "50px",
                            marginTop: "0px",
                            marginBottom: "10px",
                            marginRight: "50px"
                        }
                    }>
                           {!app?.is_selected && (<><div> {category} </div>
                        <RatingComponent rating={
                                app.rating
                            }
                            app={app}
                            votes={
                                app.votes
                            } />
                        </>)
            }
                        <CardDescription category={category}
                            cardActions={cardActions}
                            isMouseHover={isMouseHover}
                            app={app}/>

                    </div>
                </div>
        </Card>
    )
}
