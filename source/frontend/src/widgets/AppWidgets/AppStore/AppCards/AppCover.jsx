import {Avatar, Tooltip, Typography} from "antd"
import AppRating from "./AppRating"
import {CheckCircleOutlined} from "@ant-design/icons"

export function AppTitle({title}) {
    return((<div> {title}</div>))
}

export function AppAvatar({avatarImage}) {
    return avatarImage && (<Avatar src={avatarImage}/>)
}

export function AppCover({app, avatarImage}) {
    return app?.is_selected ? (<div style={
        {display: 'flex'}
    }>
        <Typography.Title level={3}
            style={
                {
                    marginLeft: "30px",
                    marginTop: "30px"
                }
        }>Current {
            app?.categories[0]
        }</Typography.Title>
        <AppRating rating={
                app.rating
            }
            votes={
                app.votes
            }
            app={app}
            style={
                {padding: '30px 0px 0px 20px'}
            }/>
    </div>) : (<>
        <div> {
            app?.is_installed && (<Tooltip title="Installed">
                <CheckCircleOutlined style={
                    {
                        position: 'absolute',
                        top: '2%',
                        right: '2%'
                    }
                }/>
            </Tooltip>)
        } </div>
       {avatarImage&& <img alt={
                app?.title
            }
            style={

                {width: "99.7%"}
            }
            src={avatarImage}/>}
    </>)
}
