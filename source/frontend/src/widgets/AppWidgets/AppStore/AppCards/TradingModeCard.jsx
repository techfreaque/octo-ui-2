import {Avatar, Card} from "antd";
import RatingComponent from "./Rating";
import AntButton from "../../../../components/Buttons/AntButton";
const {Meta} = Card;

export default function TradingModeCard({
    app,
    mouseHover,
    category,
    showDownloadButton,
    isLoading,
    setIsloading
}) {
    return (
        <Card className='productCard profileCard' hoverable
            // style={{height: "100%"}}
            onMouseEnter={mouseHover}
            onMouseLeave={mouseHover}>
            <div>
                <Meta avatar={
                        (
                            <Avatar src='https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png'/>
                        )
                    }
                    title={
                        (
                            <div className='productCard__title'>
                                {
                                app.title
                            }</div>
                        )
                    }
                    description={
                        (
                            <>

                                <div className='productCard__category'>
                                    {category} </div>,
                                <RatingComponent rating={
                                        app.rating
                                    }
                                    votes={
                                        app.votes
                                    }/>,

                                <div className='productCard__description'>
                                    {
                                    app.description
                                } </div>
                            </>
                        )
                    }/>
                <div className='productCard__price'>
                    {
                    showDownloadButton && (
                        <AntButton buttonVariant="text">
                            {
                            app.price === 'Free' ? 'Free download' : 'Buy for ' + app.price
                        } </AntButton>
                    )
                }
                    {
                    !showDownloadButton && app.price
                } </div>
            </div>
        </Card>
    )
}
