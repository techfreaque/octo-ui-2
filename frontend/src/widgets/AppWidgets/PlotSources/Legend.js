import React from 'react';
import { useBotPlottedElementsContext, useUpdateBotPlottedElementsContext } from '../../../context/BotPlottedElementsProvider';
import { FormControlLabel, Switch } from '@mui/material';

export default function Legend() {
  const updatePlottedElements = useUpdateBotPlottedElementsContext()
  const plottedElements = useBotPlottedElementsContext()

function handleChange(event){
  updatePlottedElements(prevElements => {
    const [chartLocation, id] = event.target.name.split("/")
    console.log(prevElements)
    prevElements.plot_sources[chartLocation][id].enabled = event.target.checked

    return {...prevElements}
  })
}

  if (plottedElements.plot_sources) {
    const sources = Object.keys(plottedElements.plot_sources).map(chartLocation => {
      return (
        <div>
          <h2>{chartLocation}</h2>
          {plottedElements.plot_sources[chartLocation].map((plotElement, index) => {
            return <FormControlLabel key={index} control={<Switch checked={plotElement.enabled} name={chartLocation+"/"+index}
                                                defaultChecked onChange={event=>handleChange(event)} />} 
              	    label={plotElement.title} />
          })}
        </div>)
    })
    return (
      <div>
        {sources}
      </div>
    );
  } else {
    return <></>
  }
}