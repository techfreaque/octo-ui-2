import {Avatar, Typography} from "antd"
import RatingComponent from "./Rating"

export function CardTitle({title}) {
    return((
        <div> {title}</div>
    ))
}

export function CardAvatar({avatarImage}) {
    return avatarImage && (
        <Avatar src={avatarImage}/>
    )
}

export function CardCover({app, avatarImage}) {
    return app ?. is_selected ? (
        <div style={
            {display: 'flex'}
        }>
            <Typography.Title level={3}
                style={
                    {
                        marginLeft: "30px",
                        marginTop: "30px"
                    }
            }>Current {
                app ?. categories[0]
            }</Typography.Title>
            <RatingComponent rating={
                    app.rating
                }
                votes={
                    app.votes
                }
                style={
                    {padding: '30px 0px 0px 20px'}
                }/>
        </div>
    ) : (
        <img alt={
                app ?. title
            }
            style={

                {width: "99.7%"}
            }
            src={avatarImage}/>
    )
}

export function CardDescription({category, app, isMouseHover }) {
    const lineHeight = 1.6
    const unSelectedStyle = {
        display: "block", /* or inline-block */
        textOverflow: "ellipsis",
        wordWrap: "break-word",
        overflow: "hidden",
        height: lineHeight * 3 + "em",
        maxHeight: lineHeight * 3 + "em",
        lineHeight: lineHeight + "em",
        marginBottom: "60px"
    }
    return (
        <div> {
            !app ?. is_selected && (
                <>
                    <div> {category} </div>
                    <RatingComponent rating={
                            app.rating
                        }
                        votes={
                            app.votes
                        }/>
                </>
            )
        }

            <span style={
                (isMouseHover && !app ?. is_selected) ?  {... unSelectedStyle,
                    visibility: "hidden"} : (app ?. is_selected ? {} : unSelectedStyle)
            }>
                {
                app.description
                } </span>
    
        </div>
    )
}
