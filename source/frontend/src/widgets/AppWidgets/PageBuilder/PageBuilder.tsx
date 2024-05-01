import { Alert } from "@mui/material";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import createNotification from "../../../components/Notifications/Notification";
import { botLayoutKey } from "../../../constants/backendConstants";
import { defaultBotTemplate } from "../../../constants/uiTemplate/defaultPages/allPages";
import { useBotLayoutContext } from "../../../context/config/BotLayoutProvider";
import {
  UiConfigType,
  useSaveUiConfig,
} from "../../../context/config/UiConfigProvider";
import appWidgetsProps from "../../WidgetManagement/AppWidgetProps";
import {
  AppWidgetNameType,
  NonAppWidgetNameType,
  registeredComponents,
} from "../../WidgetManagement/RegisteredAppWidgets";
import { Button, Space } from "antd";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import JsonEditor from "../../../components/Forms/JsonEditor/jedit";
import {
  errorResponseCallBackParams,
  successResponseCallBackParams,
} from "../../../api/fetchAndStoreFromBot";

interface SovWindow extends Window {
  $JsonEditors;
}

declare const window: SovWindow;

export default function PageBuilder() {
  const botLayout = useBotLayoutContext();
  const saveUiConfig = useSaveUiConfig();
  const editorName = "Page-Builder";
  function handleResetLayout() {
    const newConfig: UiConfigType = {
      [botLayoutKey]: defaultBotTemplate,
    };
    function errorCallback(payload: errorResponseCallBackParams) {
      createNotification({
        title: "Failed to restored default UI layout",
        type: "danger",
        message: `Error: ${payload.data}`,
      });
    }
    const success = (payload: successResponseCallBackParams) =>
      createNotification({ title: "Successfully restored default UI layout" });
    saveUiConfig(newConfig, success, errorCallback);
  }
  function handlePageLayoutSaving() {
    const newConfig = {
      [botLayoutKey]: {
        isCustom: true,
        layouts: window.$JsonEditors[editorName].getValue(),
      },
    };
    function errorCallback(payload: errorResponseCallBackParams) {
      createNotification({
        title: "Failed to save new UI layout",
        type: "danger",
        message: `Error: ${payload.data}`,
      });
    }
    const success = () =>
      createNotification({ title: "Successfully saved new UI layout" });
    saveUiConfig(newConfig, success, errorCallback);
  }
  return (
    <div style={{ margin: "20px" }}>
      <h1>Customize the UI</h1>
      <Alert severity="info" style={{ backgroundColor: "transparent" }}>
        Once you have saved the page layout, it wont get overridded by a updated
        default layout in the future. You should reset your config after each
        update to make sure you'll get the latest futures. You can copy the
        config of your custom config with the help of the editor, and then past
        it after resetting.
      </Alert>
      <Space wrap>
        <AntButton
          buttonVariant="primary"
          buttonType={buttonTypes.primary}
          style={{ margin: "20px 10px 20px 0" }}
          onClick={handlePageLayoutSaving}
        >
          Save Page Layout
        </AntButton>
        <Button type="primary" danger onClick={handleResetLayout}>
          Reset to default layout
        </Button>
      </Space>
      <JsonEditor
        {...defaultJsonEditorSettings()}
        schema={pageBuilderSchema()}
        startval={botLayout}
        editorName={editorName}
        disable_properties={false}
        disable_array_add={false}
        no_additional_properties={false}
        use_name_attributes={true}
        display_required_only={true}
      />
    </div>
  );
}

function pageBuilderSchema() {
  const availableComponentsList = [
    "Tab",
    ...Object.keys(registeredComponents)
      .map((componentName) => componentName)
      .sort(),
  ];
  const appWidget = () => {
    return {
      headerTemplate: "{{self.component}}- Component     {{i}}",
      type: "object",
      properties: {
        component: {
          type: "string",
          enum: availableComponentsList,
          default: "Configuration",
        },
        ...appWidgetsProps(),
      },
      options: {
        collapsed: true,
      },
    };
  };

  return {
    type: "array",
    title: "Pages",
    items: {
      type: "object",
      headerTemplate: "{{self.title}}- Page     {{i}}- path:     {{self.path}}",
      properties: {
        path: {
          type: "string",
        },
        title: {
          type: "string",
        },
        layout: {
          type: "array",
          title: "Page Layout",
          items: {
            $ref: "#/definitions/appWidget",
          },
          options: {
            collapsed: true,
          },
        },
      },
      options: {
        collapsed: true,
      },
    },
    definitions: {
      appWidget: appWidget(),
    },
  };
}

export type PagebuilderComponents = AppWidgetNameType | NonAppWidgetNameType;

export function generateAppWidgetProp(
  propName: string,
  dependentComponents: PagebuilderComponents[] | PagebuilderComponents
) {
  return {
    [propName]: {
      type: "array",
      items: {
        $ref: "#/definitions/appWidget",
      },
      options: {
        dependencies: {
          component: dependentComponents,
        },
        collapsed: true,
      },
    },
  };
}

export function generateSimpleProp({
  propName,
  dependentComponents,
  type,
  format,
  enumList,
  enumMulti,
  defaultValue,
}: {
  propName: string;
  dependentComponents: PagebuilderComponents[] | PagebuilderComponents;
  type: "string" | "boolean" | "array";
  format?: "checkbox" | "select";
  enumList?: string[];
  enumMulti?: boolean;
  defaultValue?: boolean | string;
}) {
  const items = enumList
    ? enumMulti
      ? {
          items: {
            enum: enumList,
            type: "string",
          },
        }
      : {
          enum: enumList,
          type: "string",
        }
    : {};
  return {
    [propName]: {
      type,
      format,
      ...items,
      default: defaultValue,
      options: {
        dependencies: {
          component: dependentComponents,
        },
      },
    },
  };
}
