import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DollarOutlined,
    LeftOutlined,
    ShoppingCartOutlined
} from "@ant-design/icons";
import {handlePopConfirmOpen} from "../AppActions";
import UploadAppForm from "./UploadAppForm";
import AppDownloadForm from "./DownloadForm";
import {useAppStoreUserContext, validateUploadIndo} from "../../../../../../context/data/AppStoreDataProvider";
import AppIconButton from "../../../../../../components/Buttons/AppIconButton";
import AntButton from "../../../../../../components/Buttons/AntButton";
import {Modal, Tooltip, Typography} from "antd";
import {buttonTypes} from "../../../../../../components/Buttons/AntButton";

export default function AppUpDownload({
    app,
    handleUpload,
    setUploadInfo,
    uploadInfo,
    handleDownload,
    downloadInfo,
    setDownloadInfo
}) {
    const appStoreUser = useAppStoreUserContext()
    const isSignedIn = Boolean(appStoreUser?.token)
    if (app.is_installed) {
        if (app.is_owner) {
            if (app.is_from_store) {
                const buttonText = "Publish Update"
                return handleUpload && (<UpDownloadloadAppModal onConfirm={
                        () => handleUpload((isopen) => handlePopConfirmOpen(setUploadInfo, isopen))
                    }
                    antIconComponent={CloudUploadOutlined}
                    confirmButtonIcon={CloudUploadOutlined}
                    isSelected={
                        app.is_selected
                    }
                    smallModal={true}
                    confirmTitle={buttonText}
                    disabled={
                        ! isSignedIn
                    }
                    formIsValidated={
                        validateUploadIndo(uploadInfo)
                    }
                    open={
                        uploadInfo.open
                    }
                    setInfo={setUploadInfo}

                    disabledTooltipTitle={"You need to be signed in to publish an update."}
                    confirmDescription={
                        (<UploadAppForm setUploadInfo={setUploadInfo}
                            uploadInfo={uploadInfo}
                            app={app}/>)
                    }
                    confirmButtonText={buttonText}
                    buttonTitle={buttonText}/>)
            }
            const buttonText = `Sell ${
                app.categories?.length ? "App" : (app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0])
            }`
            const confirmButtonText = `Publish ${
                app.categories?.length ? "App" : (app.categories[0] === 'Strategy Mode' ? 'Strat Mode' : app.categories[0])
            } Now`
            return handleUpload && (<UpDownloadloadAppModal onConfirm={
                    () => handleUpload((isopen) => handlePopConfirmOpen(setUploadInfo, isopen))
                }
                isSelected={
                    app.is_selected
                }
                smallModal={true}
                antIconComponent={DollarOutlined}
                confirmButtonIcon={DollarOutlined}
                confirmTitle={confirmButtonText}
                disabled={
                    ! isSignedIn
                }
                formIsValidated={
                    validateUploadIndo(uploadInfo)
                }
                open={
                    uploadInfo.open
                }
                setInfo={setUploadInfo}

                disabledTooltipTitle={"You need to be signed in to sell an app."}
                confirmDescription={
                    (<UploadAppForm setUploadInfo={setUploadInfo}
                        uploadInfo={uploadInfo}
                        app={app}/>)
                }
                confirmButtonText={confirmButtonText}
                buttonTitle={buttonText}/>);
        } else {
            const buttonText = `Update ${
                app.categories?.length ? "App" : app.categories[0]
            }`

            return handleDownload && (<UpDownloadloadAppModal // onConfirm={handleDownload}
                antIconComponent={CloudDownloadOutlined}
                // confirmButtonIcon={CloudDownloadOutlined}

                confirmTitle={buttonText}
                isSelected={
                    app.is_selected
                }
                disabled={
                    ! isSignedIn || app.updated_by_distro
                }
                disabledTooltipTitle={
                    app.updated_by_distro ? "This app gets updated by your OctoBot distribution" : "You need to be signed in to download updates."
                }
                confirmDescription={
                    (<AppDownloadForm downloadInfo={downloadInfo}
                        setDownloadInfo={setDownloadInfo}
                        handleDownload={handleDownload}
                        app={app}/>)
                }
                open={
                    downloadInfo.open
                }
                setInfo={setDownloadInfo}

                // confirmButtonText={buttonText}
                buttonTitle={buttonText}/>)
        }
    } else if (app.price) {
        if (app.is_owner) {
            const confirmButtonText = "Download"

            return handleDownload && (<UpDownloadloadAppModal // onConfirm={handleDownload}
                antIconComponent={CloudDownloadOutlined}
                confirmTitle={confirmButtonText}
                disabled={
                    ! isSignedIn
                }
                disabledTooltipTitle={"You need to be signed in to download apps."}
                confirmDescription={
                    (<AppDownloadForm downloadInfo={downloadInfo}
                        setDownloadInfo={setDownloadInfo}
                        handleDownload={handleDownload}
                        app={app}/>)
                }
                // confirmButtonIcon={CloudDownloadOutlined}
                open={
                    downloadInfo.open
                }
                isSelected={
                    app.is_selected
                }
                setInfo={setDownloadInfo}

                // confirmButtonText={confirmButtonText}
                buttonTitle={confirmButtonText}/>)
        } else {
            return handleDownload && (<UpDownloadloadAppModal // onConfirm={
                //     () => addAppStoreCart(app)
                // }
                antIconComponent={ShoppingCartOutlined}
                // confirmButtonIcon={ShoppingCartOutlined}
                confirmTitle={
                    `Buy ${
                        app.title
                    } today`
                }
                confirmDescription={
                    (<AppDownloadForm downloadInfo={downloadInfo}
                        handleDownload={handleDownload}
                        setDownloadInfo={setDownloadInfo}
                        app={app}/>)
                }
                open={
                    downloadInfo.open
                }

                setInfo={setDownloadInfo}
                // confirmButtonText={"Add To Shopping Basket"}
                buttonTitle={
                    `Buy for ${
                        app.price
                    }$ a month`
                }/>)
        }
    } else {
        const confirmButtonText = 'Download For Free'
        return handleDownload && (<UpDownloadloadAppModal // onConfirm={handleDownload}
            antIconComponent={CloudDownloadOutlined}
            confirmButtonIcon={CloudDownloadOutlined}
            confirmTitle={confirmButtonText}
            disabled={
                ! isSignedIn
            }
            open={
                downloadInfo.open
            }
            setInfo={setDownloadInfo}
            disabledTooltipTitle={"You need to be signed in to download free apps."}
            confirmDescription={
                (<AppDownloadForm downloadInfo={downloadInfo}
                    handleDownload={handleDownload}
                    setDownloadInfo={setDownloadInfo}
                    app={app}/>)
            }

            // confirmButtonText={confirmButtonText}
            buttonTitle={'Free download'}/>)
    }
}


function UpDownloadloadAppModal({
    onConfirm,
    antIconComponent,
    confirmTitle,
    disabled,
    setInfo,
    isSelected,
    open,
    disabledTooltipTitle,
    confirmDescription,
    confirmButtonText,
    buttonTitle,
    confirmButtonIcon,
    smallModal
}) {
    return (<>
        <Tooltip title={
            disabled && disabledTooltipTitle
        }>
            <div>
                <AppIconButton isSelected={isSelected}
                    disabled={disabled}
                    buttonTitle={buttonTitle}
                    antIconComponent={antIconComponent}
                    onClick={
                        () => handlePopConfirmOpen(setInfo, true)
                    }/>
            </div>
        </Tooltip>
        <Modal open={open}
            onCancel={
                () => handlePopConfirmOpen(setInfo, false)
            }
            title={
                (<Typography.Title level={1}> {confirmTitle} </Typography.Title>)
            }
            centered
            width={
                smallModal ? "450px" : "1200px"
            }
            footer={
                [(<div style={
                    {
                        display: "flex",
                        marginLeft: "auto"
                    }
                }>

                    <AntButton key="back"
                        antIconComponent={LeftOutlined}
                        buttonType={
                            buttonTypes.warning
                        }
                        style={
                            {marginLeft: "auto"}
                        }
                        size="large"
                        onClick={
                            () => handlePopConfirmOpen(setInfo, false)
                    }>
                        Go Back
                    </AntButton>
                    {
                    confirmButtonText && (<AntButton key="confirm"
                        antIconComponent={confirmButtonIcon}
                        size="large"
                        onClick={onConfirm}> {confirmButtonText} </AntButton>)
                } </div>),]
        }> {confirmDescription} </Modal>
    </>)
}
