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
                app={app}
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
