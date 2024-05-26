import { t } from "i18next";
import type {ErrorInfo } from "react";
import { Component, createElement } from "react";
import { useMemo } from "react";
import { Trans } from "react-i18next";

import createNotification from "../../components/Notifications/Notification";
import { isProduction } from "../../constants/frontendConstants";
import type {
  UiLayoutPageLayoutType,
  UiLayoutPageType,
} from "../../context/config/BotLayoutProvider";
import type {
  AppWidgetNameType} from "./RegisteredAppWidgets";
import {
  registeredComponents,
} from "./RegisteredAppWidgets";

export default function AppWidgets(props: {
  currentPage?: UiLayoutPageType;
  layout: UiLayoutPageLayoutType[]| undefined;
}): JSX.Element {
  return useMemo(() => {
    if (props.layout?.[0]) {
      return (
        <>
          {props.layout.map((element, index) => {
            if (
              typeof registeredComponents[
                element.component as AppWidgetNameType
              ] === "undefined"
            ) {
              console.error(
                "error loading widget: ",
                element.component,
                element,
                props
              );
              return <span key={`${index}-${element.component}`} />;
            }
            !isProduction &&
              console.log(`widget is loading: ${element.component}`, element);
            try {
              return (
                <ErrorBoundary
                  key={`${index}-${element.component}`}
                  componentName={element.component}
                >
                  {createElement(
                    registeredComponents[
                      element.component as AppWidgetNameType
                    ],
                    element,
                  )}
                </ErrorBoundary>
              );
            } catch (error) {
              console.error(
                "error loading widget: ",
                element.component,
                element,
                props,
                error
              );
              return <span key={`${index}-${element.component}`} />;
            }
          })}
        </>
      );
    }
    !isProduction && console.log("widget doesnt have a layout:", props);
    return <></>;
  }, [props]);
}

export class ErrorBoundary extends Component {
  override props!: { children: JSX.Element; componentName: string | undefined; };
  override state: {
    error: Error | null;
    errorInfo: ErrorInfo | null;
  } = {
    error: null,
    errorInfo: null,
  };
  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }
  override render() {
    if (this.state.errorInfo) {
      createNotification({
        title: t('componentError.oh-no-this-componentname-crashed-notification', { componentName: this.props.componentName }),
        type: "danger",
        duration: 999999,
        message: `Error: ${JSON.stringify(this.state.error?.message)}`,
      });
      return (
        <div>
          <h2><Trans i18nKey="componentError.something-went-wrong" /></h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error?.toString()}
            <br /> {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
