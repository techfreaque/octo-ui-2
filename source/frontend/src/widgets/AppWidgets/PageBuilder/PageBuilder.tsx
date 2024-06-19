import { Alert } from "@mui/material";
import type { JsonEditorWindow } from "@techfreaque/json-editor-react";
import JsonEditor from "@techfreaque/json-editor-react";
import { Button, Space } from "antd";
import { t } from "i18next";
import { Trans } from "react-i18next";

import type { errorResponseCallBackParams } from "../../../api/fetchAndStoreFromBot";
import AntButton, { buttonTypes } from "../../../components/Buttons/AntButton";
import defaultJsonEditorSettings from "../../../components/Forms/JsonEditor/JsonEditorDefaults";
import createNotification from "../../../components/Notifications/Notification";
import { botLayoutKey } from "../../../constants/backendConstants";
import { defaultBotTemplate } from "../../../constants/uiTemplate/defaultPages/allPages";
import type { UiLayoutPageType } from "../../../context/config/BotLayoutProvider";
import { useBotLayoutContext } from "../../../context/config/BotLayoutProvider";
import type { UiConfigType } from "../../../context/config/UiConfigProvider";
import { useSaveUiConfig } from "../../../context/config/UiConfigProvider";
import appWidgetsProps from "../../WidgetManagement/AppWidgetProps";
import type {
  AppWidgetNameType,
  NonAppWidgetNameType,
} from "../../WidgetManagement/RegisteredAppWidgets";
import { registeredComponents } from "../../WidgetManagement/RegisteredAppWidgets";

declare const window: JsonEditorWindow;

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
        title: t("uiEditor.failed-to-restored-default-ui-layout"),
        type: "danger",
        message: `Error: ${payload.data}`,
      });
    }
    const success = () =>
      createNotification({
        title: t("uiEditor.successfully-restored-default-ui-layout"),
      });
    saveUiConfig(newConfig, success, errorCallback);
  }
  function handlePageLayoutSaving() {
    function errorCallback(payload: errorResponseCallBackParams) {
      createNotification({
        title: t("uiEditor.failed-to-save-new-ui-layout"),
        type: "danger",
        message: `Error: ${payload.data}`,
      });
    }
    if (!window.$JsonEditors?.[editorName]) {
      createNotification({
        title: t("uiEditor.failed-to-restored-default-ui-layout"),
        type: "danger",
        message: t("uiEditor.failed-to-read-the-config-from-the-editor"),
      });
      return;
    }
    const newConfig = {
      [botLayoutKey]: {
        isCustom: true,
        layouts: window["$JsonEditors"][editorName].getValue(),
      },
    };
    const success = () =>
      createNotification({
        title: t("uiEditor.successfully-saved-new-ui-layout"),
      });
    saveUiConfig(newConfig, success, errorCallback);
  }
  return (
    <div style={{ margin: "20px" }}>
      <h1>
        <Trans i18nKey="uiEditor.customize-the-ui" />
      </h1>
      <Alert severity="info" style={{ backgroundColor: "transparent" }}>
        <Trans i18nKey="uiEditor.customize-info-text" />
      </Alert>
      <Space wrap>
        <AntButton
          buttonVariant="primary"
          buttonType={buttonTypes.primary}
          style={{ margin: "20px 10px 20px 0" }}
          onClick={handlePageLayoutSaving}
        >
          <Trans i18nKey="uiEditor.save-page-layout" />
        </AntButton>
        <Button type="primary" danger onClick={handleResetLayout}>
          <Trans i18nKey="uiEditor.reset-to-default-layout" />
        </Button>
      </Space>
      {botLayout ? (
        <JsonEditor<UiLayoutPageType[], PageBuilderSchema>
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
      ) : (
        <></>
      )}
    </div>
  );
}

type PageBuilderSchema = {
  type: string;
  title: string;
  items: {
    type: string;
    headerTemplate: string;
    properties: {
      path: {
        type: string;
      };
      title: {
        type: string;
      };
      layout: {
        type: string;
        title: string;
        items: {
          $ref: string;
        };
        options: {
          collapsed: boolean;
        };
      };
    };
    options: {
      collapsed: boolean;
    };
  };
  definitions: { appWidget: AppWidgetDefinitionType };
};

type AppWidgetDefinitionType = {
  headerTemplate: string;
  type: "object";
  properties: {
    component: {
      type: "string";
      enum: string[];
      default: "Configuration";
    };
  };
  options: {
    collapsed: true;
  };
} & {
  properties: {
    [propName: string]:
      | SimpleAppWidgetPropType
      | AppWidgetPropType
      | {
          type: "string";
          enum: string[];
          default: "Configuration";
        };
  };
};

function pageBuilderSchema(): PageBuilderSchema {
  const availableComponentsList = [
    "Tab",
    ...Object.keys(registeredComponents)
      .map((componentName) => componentName)
      .sort(),
  ];
  function appWidget(): AppWidgetDefinitionType {
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
  }

  return {
    type: "array",
    title: t("uiEditor.pages"),
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
          title: t("uiEditor.page-layout"),
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

type AppWidgetPropType = {
  type: string;
  items: {
    $ref: string;
  };
  options: {
    dependencies: {
      component: PagebuilderComponents | PagebuilderComponents[];
    };
    collapsed: boolean;
  };
};

type AppWidgetsPropType = {
  [propName: string]: AppWidgetPropType;
};

export function generateAppWidgetProp(
  propName: string,
  dependentComponents: PagebuilderComponents[] | PagebuilderComponents,
): AppWidgetsPropType {
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

type SimpleAppWidgetPropType = {
  default: string | boolean | undefined;
  options: {
    dependencies: {
      component: PagebuilderComponents | PagebuilderComponents[];
    };
  };
  items?: {
    enum: string[];
    type: "string";
  };
  enum?: string[];
  type: "string" | "boolean" | "array";
  format: "checkbox" | "select" | undefined;
};

type SimpleAppWidgetsPropType = {
  [x: string]: SimpleAppWidgetPropType;
};

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
}): SimpleAppWidgetsPropType {
  const items: {
    items?: {
      enum: string[];
      type: "string";
    };
    enum?: string[];
    type?: "string";
  } = enumList
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
