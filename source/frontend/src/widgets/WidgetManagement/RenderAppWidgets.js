import React, {createElement} from "react";
import {useMemo} from "react";
import {registeredComponents} from "./RegisteredAppWidgets";


export default function AppWidgets(props) {
    return useMemo(() => {
        if (props.layout && props.layout[0]) {
            return props.layout.map((element, index) => {
                if (typeof registeredComponents[element.component] === "undefined") {
                    console.error("error loading widget: ", element.component, element, props);
                    return (<span key={
                        `${index}-${
                            element.component
                        }`
                    }></span>);
                }
                // console.log("widget is loading: " + element.component, element)
                try {
                    return (<ErrorBoundary> {
                        createElement(registeredComponents[element.component], {
                            key: `${index}-${
                                element.component
                            }`,
                            id: index,
                            ...element
                        })
                    } </ErrorBoundary>);
                } catch (error) {
                    console.error("error loading widget: ", element.component, element, props, error);
                    return (<span key={
                        `${index}-${
                            element.component
                        }`
                    }></span>);
                }
            });
        } else {
          // console.log("widget doesnt have a layout:", props);
        }
    }, [props])
}


class ErrorBoundary extends React.Component {
    state = {
        error: null,
        errorInfo: null
    };
    componentDidCatch(error, errorInfo) {
        this.setState({error: error, errorInfo: errorInfo});
    }
    render() {
        if (this.state.errorInfo) {
            return (<div>
                <h2>Something went wrong.</h2>
                <details style={
                    {whiteSpace: "pre-wrap"}
                }> {
                    this.state.error && this.state.error.toString()
                }
                    <br/> {
                    this.state.errorInfo.componentStack
                } </details>
            </div>);
        }
        return this.props.children;
    }
}
