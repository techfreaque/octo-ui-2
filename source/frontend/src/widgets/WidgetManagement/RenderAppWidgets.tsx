import { Component, ErrorInfo, createElement } from "react";
import { useMemo } from "react";
import {
  AppWidgetNameType,
  registeredComponents,
} from "./RegisteredAppWidgets";
import { isProduction } from "../../constants/frontendConstants";
import {
  UiLayoutPageLayoutType,
  UiLayoutPageType,
} from "../../context/config/BotLayoutProvider";

export default function AppWidgets(props: {
  currentPage?: UiLayoutPageType;
  layout: UiLayoutPageLayoutType[];
}): JSX.Element {
  return useMemo(() => {
    if (props.layout?.[0]) {
      return (
        <>
          {" "}
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
                <ErrorBoundary key={`${index}-${element.component}`}>
                  {createElement(
                    registeredComponents[
                      element.component as AppWidgetNameType
                    ],
                    {
                      id: index,
                      ...element,
                    }
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
  props!: { children: JSX.Element };
  state: {
    error: Error | null;
    errorInfo: ErrorInfo | null;
  } = {
    error: null,
    errorInfo: null,
  };
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }
  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong. :(</h2>
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
