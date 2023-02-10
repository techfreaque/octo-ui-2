import { createElement } from "react";
import { useMemo } from "react";
import { registeredComponents } from "./RegisteredAppWidgets";


export default function AppWidgets(props) {
  return useMemo(() => {
    if (props.layout && props.layout[0]) {
      return props.layout.map((element, index) => {
        if (typeof registeredComponents[element.component] !== "undefined") {
          // console.log("widget is loading: " + element.component, element)
          try {
            return createElement(
              registeredComponents[element.component],
              { key: index, id: index, ...element }
            );
          } catch (error) {
            console.error("error loading widget: ", element.component, element, props, error);
            return <></>;

          }
        } else {
          console.log("error loading widget: ", element.component, element, props);
          return <></>;
        }
      });
    }
    else {
      console.log("widget doesnt have a layout:", props);
    }
  }, [props])
}
