import {Card} from "antd";
import {CardAvatar, CardDescription, CardImage, CardTitle} from "./CardComponents";
import {useBotColorsContext} from "../../../../context/config/BotColorsProvider";

export default function AppCard({
    app,
    setMouseHover,
    children,
    isMouseHover,
    avatarUrl,
    category
}) {
    const botColors = useBotColorsContext()
    const boxShadowColor = (app?.is_selected || isMouseHover) ? botColors?.borderActive : "rgb(0 0 0 / 24%)"
    const card_style = {
        boxShadow: `0px 0px 3px ${boxShadowColor}`,
        borderRadius: "4px",
        transition: "all 200ms linear 0ms",
    }
    return (
        <Card className='productCard' hoverable
            style={app?.is_selected ? {
                ...card_style
            } : {...card_style, height: '420px', maxWidth: '380px',}}
            cover={
                (
                    <CardImage avatarImage={'https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png'}
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
                            <CardAvatar avatarImage={avatarUrl}/>
                        )
                    }
                    title={
                        (
                            <CardTitle title={
                                app.title
                            }/>
                        )
                    }
                    description={!app?.is_selected &&
                        (
                            <CardDescription category={category}
                                isMouseHover={isMouseHover}
                                app={app}/>
                        )
                    }/> {children} </div>
        </Card>
    )
}
