import {Avatar, Typography} from "antd"
import RatingComponent from "./Rating"

export function CardTitle({title}) {
    return((
        <div className='productCard__title'>
            {title}</div>
    ))
}

export function CardAvatar({avatarImage}) {
    return avatarImage && (
        <Avatar src={avatarImage}/>
    )
}

export function CardImage({app, avatarImage}) {
    return app?.is_selected ? (
        <Typography.Title level={3} style={{marginLeft: "30px", marginTop: "30px"}} >Current {
            app?.categories[0]
        }</Typography.Title>
    ) : (
        <img className="productCard__image"
            alt={
                app?.title
            }
            style={

                {
                    // margin: "auto",
                    // maxWidth: "600px"
                }
            }
            src={avatarImage}/>
    )
}

export function CardDescription({category, app}) {
    const lineHeight = 1.6
    return (
        <>
            <div> {category} </div>
            <RatingComponent rating={
                    app.rating
                }
                votes={
                    app.votes
                }/>

            <span style={
                {
                    display: "block", /* or inline-block */
                    textOverflow: "ellipsis",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    height: lineHeight * 4 + "em",
                    maxHeight: lineHeight * 4 + "em",
                    lineHeight: lineHeight + "em",
                    marginBottom: "10px"
                }
            }>
                {
                app.description
            } </span>
        </>
    )
}
