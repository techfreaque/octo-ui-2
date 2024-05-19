import { DollarCircleOutlined } from "@ant-design/icons";
import { Alert, Input, Select, Switch, Tooltip } from "antd";
import {
  appVersionTags,
  appVersionTypes,
  strategyName,
} from "../../../storeConstants";
import UserInputLabel from "../../../../../../components/UserInputs/UserInputLabel";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  AppStoreAppType,
  AppStoreVersionTagType,
  AppStoreVersionTypeType,
} from "../../../../../../context/data/AppStoreDataProvider";
import { UploadInfo } from "../../AppCard";
const { TextArea } = Input;

type ApiFieldsType = "version_type" | "version_tag" | "price" | "release_notes";

export const minReleaseNotesLength = 50;

export default function UploadAppForm({
  setUploadInfo,
  uploadInfo,
  app,
}: {
  setUploadInfo: Dispatch<SetStateAction<UploadInfo>>;
  uploadInfo: UploadInfo;
  app: AppStoreAppType;
}) {
  const versionTypeOptions = Object.values(appVersionTypes).map(
    (versionType) => {
      return {
        label: versionType.title,
        value: versionType.key,
      };
    }
  );
  const versionTagOptions = Object.values(appVersionTags).map((versionTag) => {
    return {
      label: versionTag.title,
      value: versionTag.key,
    };
  });
  const defaultVersionType = versionTypeOptions[0] as {
    label: string;
    value: AppStoreVersionTypeType;
  };
  const defaultVersionTag = versionTagOptions[0] as {
    label: string;
    value: AppStoreVersionTagType;
  };
  const isStrategy = app.categories?.[0] === strategyName;
  function handleInputChange(
    key: "includePackage" | ApiFieldsType,
    value: boolean | string
  ) {
    setUploadInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }));
  }
  useEffect(() => {
    setUploadInfo((prevInfo) => {
      return {
        ...prevInfo,
        includePackage: isStrategy ? true : prevInfo.includePackage || false,
        price: prevInfo.price || app.price || 0,
        version_type: prevInfo.version_type || defaultVersionType.value,
        version_tag: prevInfo.version_tag || defaultVersionTag.value,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app]);

  return (
    <div style={{ marginRight: "20px" }}>
      {!isStrategy && (
        <UserInputLabel title={"Upload new package version"}>
          <Switch
            checked={uploadInfo?.includePackage || false}
            onChange={(checked) => handleInputChange("includePackage", checked)}
          />
        </UserInputLabel>
      )}
      {uploadInfo?.includePackage && (
        <UploadPackage
          versionTypeOptions={versionTypeOptions}
          app={app}
          versionTagOptions={versionTagOptions}
          uploadInfo={uploadInfo}
          handleInputChange={handleInputChange}
          defaultVersionType={defaultVersionType}
          defaultVersionTag={defaultVersionTag}
        />
      )}
    </div>
  );
}

function UploadPackage({
  versionTypeOptions,
  app,
  versionTagOptions,
  uploadInfo,
  handleInputChange,
  defaultVersionType,
  defaultVersionTag,
}: {
  defaultVersionType: {
    label: string;
    value: AppStoreVersionTypeType;
  };
  defaultVersionTag: {
    label: string;
    value: AppStoreVersionTagType;
  };
  versionTypeOptions: {
    label: string;
    value: AppStoreVersionTypeType;
  }[];
  app: AppStoreAppType;
  versionTagOptions: {
    label: string;
    value: AppStoreVersionTagType;
  }[];
  uploadInfo: UploadInfo;
  handleInputChange: (
    key: "includePackage" | ApiFieldsType,
    value: boolean | string
  ) => void;
}) {
  return (
    <>
      {app.is_from_store && (
        <UserInputLabel title={`Select the type of your update`}>
          <Select
            defaultValue={defaultVersionType.value}
            onChange={(value) => handleInputChange("version_type", value)}
            style={{ width: "100%" }}
            options={versionTypeOptions}
          />
        </UserInputLabel>
      )}
      <UserInputLabel title={`How stable is your ${app.categories[0]}`}>
        <Select
          defaultValue={defaultVersionTag.value}
          onChange={(value) => handleInputChange("version_tag", value)}
          style={{ width: "100%" }}
          options={versionTagOptions}
        />
      </UserInputLabel>
      <UserInputLabel title={"Share release notes"}>
        <>
          {(uploadInfo?.release_notes?.length || 0) < minReleaseNotesLength && (
            <Alert
              message={
                <>
                  <div>Let your users know what you've changed.</div>
                  <div>
                    {`Add at least ${
                      minReleaseNotesLength -
                      (uploadInfo?.release_notes?.length || 0)
                    } more characters`}
                  </div>
                </>
              }
              type="info"
              style={{ marginBottom: "5px" }}
            />
          )}
          <TextArea
            onChange={(event) =>
              handleInputChange("release_notes", event?.target?.value)
            }
            autoSize={{
              minRows: 2,
              maxRows: 6,
            }}
          />
          <div style={{ margin: "24px 0" }} />
        </>
      </UserInputLabel>
      <UserInputLabel
        title={`Define a monthly price for your ${app.categories[0]}`}
      >
        <Tooltip title={"Define a price for your app"}>
          <div>
            <Input
              onChange={(event) =>
                handleInputChange("price", event?.target?.value)
              }
              value={uploadInfo?.price || app.price}
              addonAfter={<DollarCircleOutlined />}
              defaultValue="0"
            />
          </div>
        </Tooltip>
      </UserInputLabel>
    </>
  );
}
