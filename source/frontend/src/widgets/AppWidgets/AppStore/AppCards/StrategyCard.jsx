import {Card} from "antd";
import RatingComponent from "./Rating";
import AntButton from "../../../../components/Buttons/AntButton";
import {deleteProfile, duplicateProfile, selectProfile} from "../../../../api/actions";
import {useBotDomainContext} from "../../../../context/config/BotDomainProvider";
import { useBotInfoContext } from "../../../../context/data/BotInfoProvider";
const {Meta} = Card;

export default function StrategyCard({
    app,
    mouseHover,
    category,
    showDownloadButton,
    isLoading,
    setIsloading
}) {
    const botDomain = useBotDomainContext()
    const botInfo = useBotInfoContext()
    function onSuccess() {
        setIsloading(false)
        // handleClose()
        // fetchBotInfo(true)
    }
    async function handleSelectProfile() {
        setIsloading(true)
        await selectProfile(botDomain, app.package_id, app.title, onSuccess, () => setIsloading(false))
    }
    async function handleDeleteProfile() {
        setIsloading(true)
        await deleteProfile(botDomain, app.package_id, app.title, onSuccess, () => setIsloading(false))
    }
    async function handleProfileDuplication() {
        setIsloading(true)
        await duplicateProfile(botDomain, app.package_id, app.title, onSuccess, () => setIsloading(false))
    }

    const additionalProfileInfo = botInfo?.profiles?.[app.package_id] || {}
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
