import {DollarCircleOutlined} from "@ant-design/icons";
import {Input, Typography} from "antd";

export default function UploadApp({setUploadInfo, uploadInfo, app}) {
    return (
        <>
            <Typography.Paragraph >
                Define a price for your {
                app.categories[0]
            } </Typography.Paragraph>
            <Input onChange={
                    (event) => setUploadInfo(prevInfo => ({
                        ...prevInfo,
                        price: event.target.value
                    }))
                }
                value={
                    uploadInfo?.price || app.price
                }
                addonAfter={<DollarCircleOutlined/>}
                defaultValue="5"/>
        </>
    )
}
