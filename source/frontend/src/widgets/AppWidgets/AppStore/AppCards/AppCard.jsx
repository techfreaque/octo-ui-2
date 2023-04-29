import {Card} from "antd";
import {AppAvatar, AppCover, AppTitle} from "./AppCover";
import {useBotColorsContext} from "../../../../context/config/BotColorsProvider";
import AppRating from "./AppRating";
import {CardDescription} from "./AppDescription";

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

    return (<Card // hoverable
        style={cardStyle}
        cover={
            (<AppCover avatarImage={'https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png'}
                app={app}/>)
        }
        onMouseEnter={
            () => setMouseHover(true)
        }
        onMouseLeave={
            () => setMouseHover(false)
    }>
        <div>
            <Card.Meta avatar={
                    (<>
                        <AppAvatar avatarImage={avatarUrl}/>
                    </>)
                }
                title={
                    (<AppTitle title={
                        app.title
                    }/>)
                }/>

            <div style={
                {
                    marginLeft: "50px",
                    marginTop: "0px",
                    marginBottom: "10px",
                    marginRight: "50px"
                }
            }> {
                !app?.is_selected && (<>
                    <div> {category} </div>
                    <AppRating rating={
                            app.rating
                        }
                        app={app}
                        votes={
                            app.votes
                        }/>
                </>)
            }
                <CardDescription category={category}
                    cardActions={cardActions}
                    isMouseHover={isMouseHover}
                    app={app}/>

            </div>
        </div>
    </Card>)
}
