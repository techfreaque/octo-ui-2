import AntButton from "../../../../components/Buttons/AntButton";


export default function PriceComponent(showDownloadButton, app) {
    return (
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
            ! showDownloadButton && app.price
        } </div>

    )
}
