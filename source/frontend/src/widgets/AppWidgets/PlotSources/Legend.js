import React from "react";
import {
  useBotPlottedElementsContext,
  useUpdateBotPlottedElementsContext,
} from "../../../context/BotPlottedElementsProvider";
import { Chip } from "@mui/material";
import "./legend.css";

export default function Legend() {
  const updatePlottedElements = useUpdateBotPlottedElementsContext();
  const plottedElements = useBotPlottedElementsContext();

  function handleChange(event) {
    updatePlottedElements((prevElements) => {
      const sourceId = event.target.id
        ? event.target.id
        : event.target.parentElement.id;
      const [chartLocation, id] = sourceId.split("/");
      prevElements.plot_sources[chartLocation][id].enabled =
        prevElements.plot_sources[chartLocation][id].enabled !== false
          ? false
          : true;
      return { ...prevElements };
    });
  }

  if (plottedElements.plot_sources) {
    const sources = Object.keys(plottedElements.plot_sources).map(
      (chartLocation, chartIndex) => {
        return (
          <div key={chartIndex}>
            <p className="mb-0">{chartLocation}</p>
            {plottedElements.plot_sources[chartLocation].map(
              (plotElement, index) => {
                return (
                  <div key={index}>
                    <Chip
                      key={index}
                      variant="outlined"
                      color={
                        plotElement.enabled !== false ? "primary" : undefined
                      }
                      size="small"
                      label={plotElement.title}
                      id={chartLocation + "/" + index}
                      onClick={(event) => handleChange(event)}
                      // icon={<FaceIco />}
                    />
                  </div>
                );
              }
            )}
          </div>
        );
      }
    );
    return <div className="legend-container">{sources}</div>;
  } else {
    return <></>;
  }
}
