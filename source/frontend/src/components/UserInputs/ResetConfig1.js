import { Button, Card } from 'antd'
import React from 'react'
import ResetIndividual from './ResetIndividual'


export default function ResetConfig1() {
    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
                        <Card style={{ border:'none' }}>
                            <ResetIndividual 
                                title="Reset all octo UI2 Settings" 
                                description='Resets the following settings:
                                            Backtesting Settings
                                            Optimizer Settings
                                            Trading Analysis Settings
                                            Display Settings
                                            Page Builder Page Layout'/>
                            <ResetIndividual 
                                title="Reset trading mode plotting cache" 
                                description='Resets the plotting cache for thiplotting cacheall tentacles settings'/>
                            <ResetIndividual 
                                title="Reset current trading mode settings" 
                                description='Resets the following tentacle settings to the defaults:
                                TimeFrameStrategyEvaluator
                                LorentzianClassificationMode'/>
                            <ResetIndividual 
                                title="Reset the Portfolio History" 
                                description='Resets the portfolio history'/>
                            <div style={{marginTop:'20px', display: 'flex', justifyContent:'right'}}>
                                <Button danger>Select All</Button>
                                <Button type="primary" danger style={{marginLeft:'10px'}}>Reset Selected</Button>
                            </div>
                        </Card>
        </div>
    )
}