import {CloudDownloadOutlined, CloudUploadOutlined, DollarOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import {ConfirmAction} from "../AppActions";
import UploadAppForm from "./UploadAppForm";
import AppDownloadForm from "./DownloadForm";

export default function AppUpDownload({
    app,
    handleUpload,
    setUploadInfo,
    uploadInfo,
    handleDownload
}) {
    if (app.is_installed) {
        if (app.is_owner) {
            if (app.is_from_store) {
                const buttonText = "Publish Update"
                return (<ConfirmAction onConfirm={handleUpload}
                    antIconComponent={CloudUploadOutlined}
                    isSelected={app.is_selected}
                    confirmTitle={buttonText}
                    confirmDescription={
                        (<UploadAppForm setUploadInfo={setUploadInfo}
                            uploadInfo={uploadInfo}
                            app={app}/>)
                    }
                    confirmButtonText={buttonText}
                    buttonTitle={buttonText}/>)
            } else {
                const buttonText = `Sell ${
                    app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
                }`
                const confirmButtonText = `Publish ${
                    app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0]
                } Now`
                return (<ConfirmAction onConfirm={handleUpload}
                    isSelected={app.is_selected}
                    antIconComponent={DollarOutlined}
                    confirmTitle={confirmButtonText}
                    confirmDescription={
                        (<UploadAppForm setUploadInfo={setUploadInfo}
                            uploadInfo={uploadInfo}
                            app={app}/>)
                    }
                    confirmButtonText={confirmButtonText}
                    buttonTitle={buttonText}/>)
            };
        } else {
            const buttonText = `Update ${
                app.categories[0]
            }`
            return (<ConfirmAction onConfirm={handleDownload}
                antIconComponent={CloudDownloadOutlined}
                confirmTitle={buttonText}
                isSelected={app.is_selected}
                confirmDescription={
                    (<AppDownloadForm setUploadInfo={setUploadInfo}
                        uploadInfo={uploadInfo}
                        app={app}/>)
                }
                confirmButtonText={buttonText}
                buttonTitle={buttonText}/>)
        }
    } else if (app.price) {
        if (app.is_owner) {
            const confirmButtonText = "Download"
            return (<ConfirmAction onConfirm={handleDownload}
                antIconComponent={CloudDownloadOutlined}
                confirmTitle={confirmButtonText}
                confirmDescription={
                    (<AppDownloadForm setUploadInfo={setUploadInfo}
                        uploadInfo={uploadInfo}
                        app={app}/>)
                }
                confirmButtonText={confirmButtonText}
                buttonTitle={confirmButtonText}/>)
        } else {
            const confirmButtonText = `Buy for ${
                app.price
            }$ / month`
            return (<ConfirmAction // onConfirm={handleDownload}
                antIconComponent={ShoppingCartOutlined}
                confirmTitle={confirmButtonText}
                // confirmDescription={confirmDescription}
                confirmButtonText={confirmButtonText}
                buttonTitle={confirmButtonText}/>)
        }
    } else {
        const confirmButtonText = 'Download For Free'
        return (<ConfirmAction onConfirm={handleDownload}
            antIconComponent={CloudDownloadOutlined}
            confirmTitle={confirmButtonText}
            confirmDescription={
                (<AppDownloadForm setUploadInfo={setUploadInfo}
                    uploadInfo={uploadInfo}
                    app={app}/>)
            }
            confirmButtonText={confirmButtonText}
            buttonTitle={'Free download'}/>)
    }
}
