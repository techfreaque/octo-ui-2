import {Card, Col} from "antd";
import RatingComponent from "./Rating";
import AntButton from "../../../../components/Buttons/AntButton";
const {Meta} = Card;

export default function StrategyCard({app, mouseHover, category, showDownloadButton}) {

    return (
        <Card className='productCard' hoverable
            // style={{height: "100%"}}
                cover={
                    <img
                className="productCard__image"
                alt="example"
                src='https://tradeciety.com/hubfs/Imported_Blog_Media/GBPUSDH45.png'/>
                }
                onMouseEnter={mouseHover}
                onMouseLeave={mouseHover}>
                <div>
                    <Meta title={
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
                                        {category} </div>
                                    <RatingComponent rating={
                                            app.rating
                                        }
                                        votes={
                                            app.votes
                                        }/>

                                    <div className='productCard__description'>
                                        {
                                        app.description
                                    } </div>
                                </>
                            )
                        }/>
                    <div key="productCardPrice" className='productCard__price'>
                        {
                        showDownloadButton && <AntButton buttonVariant="text">
                            {
                            app.price ? `Buy for ${
                                app.price
                            }$` : 'Free download'
                        } </AntButton>
                    }
                        {
                        !showDownloadButton && (app.price ? app.price + "$" : undefined)
                    } </div>
                </div>
            </Card>
    )
}

